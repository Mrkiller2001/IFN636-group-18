import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import MapComponent from '../components/Map/MapComponent';

export default function Map() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([-74.006, 40.7128]); // Default NYC
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    showBins: true,
    showTrucks: true,
    showRoutes: true,
    binStatus: 'all',
    truckStatus: 'all'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [binsRes, trucksRes, routesRes] = await Promise.all([
          axiosInstance.get('/api/bins', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axiosInstance.get('/api/trucks', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axiosInstance.get('/api/routes', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);

        // Bins already have proper GeoJSON coordinates from our seeded data
        const binsWithCoords = binsRes.data || [];
        console.log('Map page - Bins loaded:', binsWithCoords.length);
        if (binsWithCoords.length > 0) {
          console.log('First bin location:', binsWithCoords[0].location);
        }

        // Use actual truck locations from database (they already have coordinates)
        const trucksWithCoords = trucksRes.data || [];
        console.log('Map page - Trucks loaded:', trucksWithCoords.length);
        if (trucksWithCoords.length > 0) {
          console.log('First truck location:', trucksWithCoords[0].currentLocation);
        }

        // Routes data - now with proper coordinate paths
        const routesData = routesRes.data || [];
        console.log('Map page - Routes loaded:', routesData.length);
        if (routesData.length > 0) {
          console.log('First route coordinates:', routesData[0].coordinates);
        }

        setBins(binsWithCoords);
        setTrucks(trucksWithCoords);
        setRoutes(routesData);

        // Set map center to first bin if available (using GeoJSON coordinates)
        if (binsWithCoords.length > 0 && binsWithCoords[0].location?.coordinates) {
          const [lng, lat] = binsWithCoords[0].location.coordinates;
          setMapCenter([lng, lat]);
        }
      } catch (error) {
        console.error('Failed to fetch map data:', error);
        // Set empty arrays on error to prevent crashes
        setBins([]);
        setTrucks([]);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  const handleBinClick = (bin) => {
    navigate(`/bins/${bin._id}`);
  };

  const handleTruckClick = (truck) => {
    navigate(`/trucks/${truck._id}`);
  };

  const filteredBins = bins.filter(bin => {
    if (!filters.showBins) return false;
    if (filters.binStatus === 'all') return true;
    return bin.status === filters.binStatus;
  });

  const filteredTrucks = trucks.filter(truck => {
    if (!filters.showTrucks) return false;
    if (filters.truckStatus === 'all') return true;
    return truck.status === filters.truckStatus;
  });

  const filteredRoutes = filters.showRoutes ? routes : [];

  if (loading) {
    return (
      <ResponsiveLayout title="Map View">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#55ac62] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 font-['Kreon'] text-sm">Loading map data...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Map View">
      {/* Map Container */}
      <div className="h-[420px] relative">
        <MapComponent
          bins={filteredBins}
          trucks={filteredTrucks}
          routes={filteredRoutes}
          center={mapCenter}
          zoom={13}
          height="420px"
          interactive={true}
          onBinClick={handleBinClick}
          onTruckClick={handleTruckClick}
        />

        {/* Filter Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
            </svg>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-48 z-10">
            <h3 className="font-['Karla'] font-semibold text-sm mb-3 text-[#086214]">Map Filters</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showBins}
                  onChange={(e) => setFilters(f => ({ ...f, showBins: e.target.checked }))}
                  className="w-4 h-4 text-[#55ac62] border-gray-300 rounded focus:ring-[#55ac62]"
                />
                <span className="ml-2 text-xs font-['Kreon']">Show Bins</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showTrucks}
                  onChange={(e) => setFilters(f => ({ ...f, showTrucks: e.target.checked }))}
                  className="w-4 h-4 text-[#55ac62] border-gray-300 rounded focus:ring-[#55ac62]"
                />
                <span className="ml-2 text-xs font-['Kreon']">Show Trucks</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showRoutes}
                  onChange={(e) => setFilters(f => ({ ...f, showRoutes: e.target.checked }))}
                  className="w-4 h-4 text-[#55ac62] border-gray-300 rounded focus:ring-[#55ac62]"
                />
                <span className="ml-2 text-xs font-['Kreon']">Show Routes</span>
              </label>

              {filters.showBins && (
                <div>
                  <label className="block text-xs font-['Kreon'] text-gray-700 mb-1">Bin Status</label>
                  <select
                    value={filters.binStatus}
                    onChange={(e) => setFilters(f => ({ ...f, binStatus: e.target.value }))}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All Bins</option>
                    <option value="Empty">Empty</option>
                    <option value="Quarter">Quarter Full</option>
                    <option value="Half">Half Full</option>
                    <option value="Three Quarter">Three Quarter</option>
                    <option value="Full">Full</option>
                    <option value="Overflowing">Overflowing</option>
                  </select>
                </div>
              )}

              {filters.showTrucks && (
                <div>
                  <label className="block text-xs font-['Kreon'] text-gray-700 mb-1">Truck Status</label>
                  <select
                    value={filters.truckStatus}
                    onChange={(e) => setFilters(f => ({ ...f, truckStatus: e.target.value }))}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="all">All Trucks</option>
                    <option value="Available">Available</option>
                    <option value="On Route">On Route</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h3 className="font-['Karla'] font-semibold text-sm mb-2 text-[#086214]">Legend</h3>
          <div className="space-y-1 text-xs font-['Kreon']">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#55ac62] rounded mr-2"></div>
              <span>Bins ({filteredBins.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Trucks ({filteredTrucks.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
              <span>Routes ({filteredRoutes.length})</span>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}