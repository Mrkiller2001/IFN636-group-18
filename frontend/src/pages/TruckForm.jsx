import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import FormInput from '../components/UI/FormInput';
import AddressInput from '../components/AddressInput';

export default function TruckForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    licensePlate: '',
    capacity: '',
    status: 'Available',
    driverId: '',
    fuelLevel: '',
    lastMaintenanceDate: '',
    currentLocation: {
      address: '',
      coordinates: []
    }
  });

  useEffect(() => {
    if (isEditing) {
      const fetchTruck = async () => {
        try {
          const { data } = await axiosInstance.get(`/api/trucks/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setFormData({
            licensePlate: data.licensePlate || '',
            capacity: data.capacity || '',
            status: data.status || 'Available',
            driverId: data.driverId || '',
            fuelLevel: data.fuelLevel || '',
            lastMaintenanceDate: data.lastMaintenanceDate ? 
              new Date(data.lastMaintenanceDate).toISOString().split('T')[0] : '',
            currentLocation: {
              address: data.currentLocation?.address || '',
              coordinates: data.currentLocation?.coordinates || []
            }
          });
        } catch (err) {
          setError('Failed to load truck data');
        }
      };
      fetchTruck();
    }
  }, [id, isEditing, user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/trucks/${id}` : '/api/trucks';
      const method = isEditing ? 'put' : 'post';

      await axiosInstance[method](url, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      navigate('/trucks');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save truck');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Icons
  const TruckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );

  const LocationIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  const CapacityIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16"></path>
      <path d="M10 11v6"></path>
      <path d="M14 11v6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const FuelIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18l-3 3-3-3 3-3 3 3H3v0z"></path>
      <path d="M5 17h14v4H5z"></path>
      <path d="M5 7h14v4H5z"></path>
    </svg>
  );

  return (
    <MobileLayout title={isEditing ? 'Edit Truck' : 'Add Truck'}>
      {/* Map Background */}
      <div className="relative h-[420px] bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 bg-gray-100 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 relative">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(139, 195, 74, 0.1) 35px, rgba(139, 195, 74, 0.1) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(139, 195, 74, 0.1) 35px, rgba(139, 195, 74, 0.1) 36px)'
            }}></div>
          </div>
        </div>
        
        {/* Current location marker if editing */}
        {isEditing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#55ac62] p-2 rounded-full shadow-lg">
              <TruckIcon />
            </div>
          </div>
        )}
      </div>

      {/* Form Panel */}
      <div className="bg-white shadow-lg relative">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-4">
          <h2 className="font-['Karla'] font-semibold text-[20px] text-[#086214] mb-4">
            Truck Details
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              placeholder="License Plate"
              value={formData.licensePlate}
              onChange={(e) => handleChange('licensePlate', e.target.value)}
              icon={<TruckIcon />}
              required
            />

            <AddressInput
              placeholder="Current Address"
              value={formData.currentLocation.address}
              onAddressSelect={(addressData) => {
                if (addressData) {
                  setFormData(prev => ({
                    ...prev,
                    currentLocation: {
                      address: addressData.formattedAddress,
                      coordinates: addressData.coordinates,
                      lat: addressData.lat,
                      lng: addressData.lng
                    }
                  }));
                }
              }}
              icon={<LocationIcon />}
            />

            <FormInput
              type="number"
              placeholder="Capacity (L)"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              icon={<CapacityIcon />}
              required
            />

            <FormInput
              type="text"
              placeholder="Driver ID"
              value={formData.driverId}
              onChange={(e) => handleChange('driverId', e.target.value)}
              icon={<UserIcon />}
            />

            <FormInput
              type="number"
              placeholder="Fuel Level (%)"
              value={formData.fuelLevel}
              onChange={(e) => handleChange('fuelLevel', e.target.value)}
              icon={<FuelIcon />}
              min="0"
              max="100"
            />

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              >
                <option value="Available">Available</option>
                <option value="On Route">On Route</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Last Maintenance Date
              </label>
              <input
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <GreenButton
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : isEditing ? 'UPDATE TRUCK' : 'SAVE TRUCK'}
              </GreenButton>
              
              <GreenButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/trucks')}
                className="flex-1"
              >
                CANCEL
              </GreenButton>
            </div>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
}