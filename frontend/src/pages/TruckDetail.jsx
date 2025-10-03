import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function TruckDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/trucks/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTruck(data);
      } catch (err) {
        setError('Failed to load truck details');
      } finally {
        setLoading(false);
      }
    };

    fetchTruck();
  }, [id, user.token]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      try {
        await axiosInstance.delete(`/api/trucks/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        navigate('/trucks');
      } catch (err) {
        setError('Failed to delete truck');
      }
    }
  };

  if (loading) return (
    <MobileLayout title="Truck Details">
      <div className="p-4">Loading...</div>
    </MobileLayout>
  );

  if (error) return (
    <MobileLayout title="Truck Details">
      <div className="p-4 text-red-600">{error}</div>
    </MobileLayout>
  );

  if (!truck) return (
    <MobileLayout title="Truck Details">
      <div className="p-4">Truck not found</div>
    </MobileLayout>
  );

  const statusColors = {
    'Available': '#55ac62',
    'On Route': '#3e974b',
    'Maintenance': '#f59e0b',
    'Out of Service': '#ef4444'
  };

  // Icons
  const TruckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  const CapacityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  );

  const FuelIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18l-3 3-3-3 3-3 3 3H3v0z"></path>
      <path d="M5 17h14v4H5z"></path>
      <path d="M5 7h14v4H5z"></path>
    </svg>
  );

  return (
    <MobileLayout title="Truck Details">
      {/* Map showing truck location */}
      <div className="h-[420px]">
        <MapComponent
          bins={[]}
          trucks={[truck]}
          routes={[]}
          center={truck.currentLocation?.coordinates ? [truck.currentLocation.coordinates[0], truck.currentLocation.coordinates[1]] : [-74.006, 40.7128]}
          zoom={16}
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
                {truck.licensePlate}
              </h2>
              <div 
                className="px-3 py-1 rounded-full text-white text-xs font-semibold inline-block"
                style={{ backgroundColor: statusColors[truck.status] || '#55ac62' }}
              >
                {truck.status}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <LocationIcon />
              <div>
                <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Location</p>
                <p className="font-['Kreon'] text-[14px] text-gray-900">
                  {truck.currentLocation?.address || 'Location not available'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CapacityIcon />
              <div>
                <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Capacity</p>
                <p className="font-['Kreon'] text-[14px] text-gray-900">{truck.capacity} L</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FuelIcon />
              <div>
                <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Fuel Level</p>
                <p className="font-['Kreon'] text-[14px] text-gray-900">{truck.fuelLevel}%</p>
              </div>
            </div>

            {truck.driverId && (
              <div className="flex items-center space-x-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Driver ID</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">{truck.driverId}</p>
                </div>
              </div>
            )}

            {truck.lastMaintenanceDate && (
              <div className="flex items-center space-x-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>
                  <p className="font-['Kreon'] font-semibold text-[12px] text-gray-500">Last Maintenance</p>
                  <p className="font-['Kreon'] text-[14px] text-gray-900">
                    {new Date(truck.lastMaintenanceDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <GreenButton
              onClick={() => navigate(`/trucks/${id}/edit`)}
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