import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function Trucks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      const { data } = await axiosInstance.get('/api/trucks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTrucks(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load trucks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTruckClick = (truck) => {
    navigate(`/trucks/${truck._id}`);
  };

  return (
    <ResponsiveLayout title="Trucks Management">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Trucks Map</h2>
                <GreenButton 
                  onClick={() => navigate('/trucks/add')}
                  size="sm"
                  className="px-4"
                >
                  ADD TRUCK
                </GreenButton>
              </div>
              <div className="h-[calc(100%-60px)]">
                <MapComponent
                  bins={[]}
                  trucks={trucks}
                  routes={[]}
                  center={[-74.006, 40.7128]}
                  zoom={13}
                  height="100%"
                  interactive={true}
                  onTruckClick={handleTruckClick}
                />
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Trucks List ({trucks.length})</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <div className="divide-y divide-gray-200">
                {trucks.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    No trucks found
                  </div>
                )}
                
                {trucks.map((truck) => {
                  const statusColors = {
                    'Available': '#55ac62',
                    'On Route': '#3e974b', 
                    'Maintenance': '#f59e0b',
                    'Out of Service': '#ef4444'
                  };

                  return (
                    <div
                      key={truck._id}
                      onClick={() => navigate(`/trucks/${truck._id}`)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {truck.licensePlate || `Truck ${truck._id?.slice(-6)}`}
                        </h3>
                        <div 
                          className="px-2 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: statusColors[truck.status] || '#55ac62' }}
                        >
                          {truck.status}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{truck.currentLocation?.address || 'Unknown location'}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{truck.capacity}L capacity</span>
                        
                        {truck.driverId && (
                          <span>Driver: {truck.driverId}</span>
                        )}
                        
                        {truck.fuelLevel !== undefined && (
                          <div className="flex items-center space-x-1">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${truck.fuelLevel}%`,
                                  backgroundColor: truck.fuelLevel >= 60 ? '#55ac62' : truck.fuelLevel >= 30 ? '#f59e0b' : '#ef4444'
                                }}
                              ></div>
                            </div>
                            <span>Fuel {truck.fuelLevel}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Real Map showing all trucks */}
        <div className="h-[420px] relative">
          <MapComponent
            bins={[]}
            trucks={trucks}
            routes={[]}
            center={[-74.006, 40.7128]} // NYC center
            zoom={13}
            height="420px"
            interactive={true}
            onTruckClick={handleTruckClick}
          />
          
          {/* ADD TRUCK Button */}
          <div className="absolute top-4 right-4 z-10">
            <GreenButton 
              onClick={() => navigate('/trucks/add')}
              size="sm"
              className="px-3"
            >
              ADD TRUCK
            </GreenButton>
          </div>
        </div>

        {/* Trucks List */}
        <div className="relative bg-white -mt-1">
          <div className="p-4 space-y-3">
            {trucks.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 font-['Kreon'] text-[14px]">
                No trucks found
              </div>
            )}
            
            {trucks.map((truck) => {
              const statusColors = {
                'Available': '#55ac62',
                'On Route': '#3e974b', 
                'Maintenance': '#f59e0b',
                'Out of Service': '#ef4444'
              };

              return (
                <div
                  key={truck._id}
                  onClick={() => navigate(`/trucks/${truck._id}`)}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-['Karla'] font-semibold text-[16px] text-[#086214]">
                      {truck.licensePlate || `Truck ${truck._id?.slice(-6)}`}
                    </h3>
                    <div 
                      className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: statusColors[truck.status] || '#55ac62' }}
                    >
                      {truck.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="font-['Kreon'] text-[12px]">{truck.currentLocation?.address || 'Unknown location'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                      <span className="font-['Kreon'] text-[12px]">{truck.capacity}L capacity</span>
                    </div>
                    
                    {truck.driverId && (
                      <div className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="font-['Kreon'] text-[12px]">{truck.driverId}</span>
                      </div>
                    )}
                    
                    {truck.fuelLevel !== undefined && (
                      <div className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="3" y1="22" x2="21" y2="22"></line>
                          <line x1="6" y1="18" x2="6" y2="11"></line>
                          <line x1="10" y1="18" x2="10" y2="11"></line>
                          <line x1="14" y1="18" x2="14" y2="11"></line>
                          <line x1="18" y1="18" x2="18" y2="11"></line>
                          <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26"></polygon>
                        </svg>
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${truck.fuelLevel}%`,
                              backgroundColor: truck.fuelLevel >= 60 ? '#55ac62' : truck.fuelLevel >= 30 ? '#f59e0b' : '#ef4444'
                            }}
                          ></div>
                        </div>
                        <span className="font-['Kreon'] text-[12px]">{truck.fuelLevel}%</span>
                      </div>
                    )}
                    
                    {truck.lastMaintenanceDate && (
                      <div className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="font-['Kreon'] text-[12px]">
                          {new Date(truck.lastMaintenanceDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading trucks...</div>
        </div>
      )}
      
      {err && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          Error: {err}
        </div>
      )}
    </ResponsiveLayout>
  );
}