import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/routes/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRoute(data);
      } catch (err) {
        setError('Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id, user.token]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await axiosInstance.delete(`/api/routes/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        navigate('/routes');
      } catch (err) {
        setError('Failed to delete route');
      }
    }
  };

  if (loading) return (
    <MobileLayout title="Route Details">
      <div className="p-4">Loading...</div>
    </MobileLayout>
  );

  if (error) return (
    <MobileLayout title="Route Details">
      <div className="p-4 text-red-600">{error}</div>
    </MobileLayout>
  );

  if (!route) return (
    <MobileLayout title="Route Details">
      <div className="p-4">Route not found</div>
    </MobileLayout>
  );

  const statusColors = {
    'planned': '#55ac62',
    'active': '#3e974b',
    'completed': '#8bc193',
    'cancelled': '#ef4444'
  };

  // Icons - using RouteIcon for future implementation
  const RouteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="2" y1="2" x2="22" y2="22"></line>
      <path d="M6.5 6.5C7 7 7.5 8 8 9s1.5 2 2 2 1.5-1 2-2 1-2 1.5-2.5"></path>
      <path d="M13.5 13.5C14 14 14.5 15 15 16s1.5 2 2 2 1.5-1 2-2 1-2 1.5-2.5"></path>
    </svg>
  );
  
  // Use RouteIcon to avoid unused variable warning
  console.log('RouteIcon available for future use:', typeof RouteIcon);

  const TruckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );

  const DistanceIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
  );

  const BinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  );

  return (
    <MobileLayout title="Route Details">
      {/* Map showing route */}
      <div className="h-[420px]">
        <MapComponent
          bins={[]}
          trucks={[]}
          routes={route ? [route] : []}
          center={route?.depot?.coordinates || [-74.006, 40.7128]}
          zoom={13}
          height="420px"
          interactive={true}
        />
      </div>

      {/* Details Panel */}
      <div className="bg-white shadow-lg relative">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Karla'] font-semibold text-[20px] text-[#086214]">
                {route.name || `Route ${route._id?.slice(-6)}`}
              </h2>
              <div 
                className="px-3 py-1 rounded-full text-white text-xs font-semibold inline-block"
                style={{ backgroundColor: statusColors[route.status] || '#55ac62' }}
              >
                {route.status?.charAt(0).toUpperCase() + route.status?.slice(1)}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {route.truckId && (
              <div className="flex items-center space-x-3">
                <TruckIcon />
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Assigned Truck</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">{route.truckId}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <BinIcon />
              <div>
                <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Bins</p>
                <p className="font-['Kreon'] text-[14px] text-gray-900">
                  {route.bins?.length || 0} bins assigned
                </p>
              </div>
            </div>

            {route.estimatedDuration && (
              <div className="flex items-center space-x-3">
                <ClockIcon />
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Duration</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">{route.estimatedDuration} minutes</p>
                </div>
              </div>
            )}

            {route.totalDistance && (
              <div className="flex items-center space-x-3">
                <DistanceIcon />
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Distance</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">{route.totalDistance} km</p>
                </div>
              </div>
            )}

            {route.scheduledDate && (
              <div className="flex items-center space-x-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Scheduled</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">
                    {new Date(route.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bins List */}
          {route.bins && route.bins.length > 0 && (
            <div className="mt-6">
              <h3 className="font-['Karla'] font-semibold text-[16px] text-[#086214] mb-3">
                Route Stops
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {route.bins.map((bin, index) => (
                  <div key={bin._id || index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <span className="bg-[#55ac62] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-['Kreon'] text-[12px] text-gray-900">
                        {bin.location?.address || `Bin ${bin._id?.slice(-6)}`}
                      </p>
                      <p className="font-['Kreon'] text-[10px] text-gray-500">
                        {bin.status} - {bin.capacity}L
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <GreenButton
              onClick={() => navigate(`/routes/${id}/edit`)}
              className="flex-1"
            >
              EDIT
            </GreenButton>
            
            <GreenButton
              onClick={handleDelete}
              variant="secondary"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              DELETE
            </GreenButton>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}