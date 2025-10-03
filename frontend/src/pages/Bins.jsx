import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function Bins() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      const { data } = await axiosInstance.get('/api/bins', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBins(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load bins');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const handleBinClick = (bin) => {
    navigate(`/bins/${bin._id}`);
  };

  return (
    <ResponsiveLayout title="Bins Management">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Bins Map</h2>
                <GreenButton 
                  onClick={() => navigate('/bins/add')}
                  size="sm"
                  className="px-4"
                >
                  ADD BIN
                </GreenButton>
              </div>
              <div className="h-[calc(100%-60px)]">
                <MapComponent
                  bins={bins}
                  trucks={[]}
                  routes={[]}
                  center={[-74.006, 40.7128]}
                  zoom={13}
                  height="100%"
                  interactive={true}
                  onBinClick={handleBinClick}
                />
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bins List ({bins.length})</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <div className="divide-y divide-gray-200">
                {bins.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    No bins found
                  </div>
                )}
                
                {bins.map((bin) => {
                  const statusColors = {
                    'normal': '#55ac62',
                    'needs_pickup': '#ef4444',
                    'maintenance': '#f59e0b',
                    'full': '#dc2626'
                  };

                  const typeColors = {
                    'general': '#6b7280',
                    'recycle': '#059669',
                    'organic': '#d97706',
                    'hazardous': '#dc2626'
                  };

                  return (
                    <div
                      key={bin._id}
                      onClick={() => navigate(`/bins/${bin._id}`)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {bin.name || `Bin ${bin._id?.slice(-6)}`}
                        </h3>
                        <div 
                          className="px-2 py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: statusColors[bin.status] || '#55ac62' }}
                        >
                          {bin.status?.charAt(0).toUpperCase() + bin.status?.slice(1)?.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{bin.address}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: typeColors[bin.type] || '#6b7280' }}
                          ></div>
                          <span className="capitalize">{bin.type}</span>
                        </div>
                        
                        <span>{bin.capacityLitres}L</span>
                        
                        {bin.latestFillPct !== undefined && (
                          <div className="flex items-center space-x-1">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${bin.latestFillPct}%`,
                                  backgroundColor: bin.latestFillPct >= 80 ? '#ef4444' : bin.latestFillPct >= 60 ? '#f59e0b' : '#55ac62'
                                }}
                              ></div>
                            </div>
                            <span>{bin.latestFillPct}%</span>
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
        {/* Real Map showing all bins */}
        <div className="h-[420px] relative">
          <MapComponent
            bins={bins}
            trucks={[]}
            routes={[]}
            center={[-74.006, 40.7128]} // NYC center
            zoom={13}
            height="420px"
            interactive={true}
            onBinClick={handleBinClick}
          />
          
          {/* ADD BIN Button */}
          <div className="absolute top-4 right-4 z-10">
            <GreenButton 
              onClick={() => navigate('/bins/add')}
              size="sm"
              className="px-3"
            >
              ADD BIN
            </GreenButton>
          </div>
        </div>

        {/* Bins List */}
        <div className="relative bg-white -mt-1">
          <div className="p-4 space-y-3">
            {bins.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 font-['Kreon'] text-[14px]">
                No bins found
              </div>
            )}
            
            {bins.map((bin) => {
              const statusColors = {
                'normal': '#55ac62',
                'needs_pickup': '#ef4444',
                'maintenance': '#f59e0b',
                'full': '#dc2626'
              };

              const typeColors = {
                'general': '#6b7280',
                'recycle': '#059669',
                'organic': '#d97706',
                'hazardous': '#dc2626'
              };

              return (
                <div
                  key={bin._id}
                  onClick={() => navigate(`/bins/${bin._id}`)}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-['Karla'] font-semibold text-[16px] text-[#086214]">
                      {bin.name || `Bin ${bin._id?.slice(-6)}`}
                    </h3>
                    <div 
                      className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: statusColors[bin.status] || '#55ac62' }}
                    >
                      {bin.status?.charAt(0).toUpperCase() + bin.status?.slice(1)?.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="font-['Kreon'] text-[12px]">{bin.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: typeColors[bin.type] || '#6b7280' }}
                      ></div>
                      <span className="font-['Kreon'] text-[12px] capitalize">{bin.type}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5V5h14l2 16z"></path>
                        <path d="M7 7v10"></path>
                        <path d="M12 7v10"></path>
                        <path d="M17 7v10"></path>
                      </svg>
                      <span className="font-['Kreon'] text-[12px]">{bin.capacityLitres}L</span>
                    </div>
                    
                    {bin.latestFillPct !== undefined && (
                      <div className="flex items-center space-x-1">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${bin.latestFillPct}%`,
                              backgroundColor: bin.latestFillPct >= 80 ? '#ef4444' : bin.latestFillPct >= 60 ? '#f59e0b' : '#55ac62'
                            }}
                          ></div>
                        </div>
                        <span className="font-['Kreon'] text-[12px]">{bin.latestFillPct}%</span>
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
          <div className="text-gray-500">Loading bins...</div>
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
