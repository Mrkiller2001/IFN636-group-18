import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function RoutesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      setErr('');
      setLoading(true);
      const { data } = await axiosInstance.get('/api/routes', { headers });
      setPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { load(); }, [load]);

  const handleRouteClick = (route) => {
    navigate(`/routes/${route._id}`);
  };

  return (
    <ResponsiveLayout title="Routes Management">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Routes Map</h2>
                <GreenButton 
                  onClick={() => navigate('/routes/add')}
                  size="sm"
                  className="px-4"
                >
                  ADD ROUTE
                </GreenButton>
              </div>
              <div className="h-[calc(100%-60px)]">
                <MapComponent
                  bins={[]}
                  trucks={[]}
                  routes={plans}
                  center={[-74.006, 40.7128]}
                  zoom={13}
                  height="100%"
                  interactive={true}
                  onRouteClick={handleRouteClick}
                />
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Routes List ({plans.length})</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <div className="divide-y divide-gray-200">
                {plans.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    No routes found
                  </div>
                )}
                
                {plans.map((route) => {
                  const statusColors = {
                    'planned': '#55ac62',
                    'active': '#3e974b',
                    'completed': '#8bc193',
                    'cancelled': '#ef4444'
                  };

                  return (
                    <div
                      key={route._id}
                      onClick={() => navigate(`/routes/${route._id}`)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {route.name || `Route ${route._id?.slice(-6)}`}
                        </h3>
                        <div 
                          className="px-2 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: statusColors[route.status] || '#55ac62' }}
                        >
                          {route.status?.charAt(0).toUpperCase() + route.status?.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {route.truckId && (
                          <span>Truck: {route.truckId}</span>
                        )}
                        
                        <span>{route.bins?.length || 0} bins</span>
                        
                        {route.scheduledDate && (
                          <span>
                            {new Date(route.scheduledDate).toLocaleDateString()}
                          </span>
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
        {/* Real Map showing all routes */}
        <div className="h-[420px] relative">
          <MapComponent
            bins={[]}
            trucks={[]}
            routes={plans}
            center={[-74.006, 40.7128]} // NYC center
            zoom={13}
            height="420px"
            interactive={true}
            onRouteClick={handleRouteClick}
          />
          
          {/* ADD ROUTE Button */}
          <div className="absolute top-4 right-4 z-10">
            <GreenButton 
              onClick={() => navigate('/routes/add')}
              size="sm"
              className="px-3"
            >
              ADD ROUTE
            </GreenButton>
          </div>
        </div>

        {/* Routes List */}
        <div className="relative bg-white -mt-1">
          <div className="p-4 space-y-3">
            {plans.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 font-['Kreon'] text-[14px]">
                No routes found
              </div>
            )}
            
            {plans.map((route) => {
              const statusColors = {
                'planned': '#55ac62',
                'active': '#3e974b',
                'completed': '#8bc193',
                'cancelled': '#ef4444'
              };

              return (
                <div
                  key={route._id}
                  onClick={() => navigate(`/routes/${route._id}`)}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-['Karla'] font-semibold text-[16px] text-[#086214]">
                      {route.name || `Route ${route._id?.slice(-6)}`}
                    </h3>
                    <div 
                      className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: statusColors[route.status] || '#55ac62' }}
                    >
                      {route.status?.charAt(0).toUpperCase() + route.status?.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {route.truckId && (
                      <div className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <span className="font-['Kreon'] text-[12px]">{route.truckId}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h16"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                      </svg>
                      <span className="font-['Kreon'] text-[12px]">{route.bins?.length || 0} bins</span>
                    </div>
                    
                    {route.scheduledDate && (
                      <div className="flex items-center space-x-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="font-['Kreon'] text-[12px]">
                          {new Date(route.scheduledDate).toLocaleDateString()}
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
          <div className="text-gray-500">Loading routes...</div>
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
