import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import FormInput from '../components/UI/FormInput';
import AddressInput from '../components/AddressInput';
import MapComponent from '../components/Map/MapComponent';

export default function BinForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: {
      type: 'Point',
      coordinates: [0, 0] // [lng, lat]
    },
    capacityLitres: '',
    status: 'normal',
    type: 'general'
  });

  useEffect(() => {
    if (isEditing) {
      const fetchBin = async () => {
        try {
          const { data } = await axiosInstance.get(`/api/bins/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setFormData({
            name: data.name || '',
            address: data.address || '',
            location: {
              type: 'Point',
              coordinates: data.location?.coordinates || [0, 0]
            },
            capacityLitres: data.capacityLitres || '',
            status: data.status || 'normal',
            type: data.type || 'general'
          });
        } catch (err) {
          setError('Failed to load bin data');
        }
      };
      fetchBin();
    }
  }, [id, isEditing, user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/bins/${id}` : '/api/bins';
      const method = isEditing ? 'put' : 'post';

      await axiosInstance[method](url, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      navigate('/bins');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save bin');
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

  return (
    <MobileLayout title={isEditing ? 'Edit Bin' : 'Add Bin'}>
      {/* Map Preview */}
      <div className="relative h-[420px]">
        <MapComponent
          bins={formData.location && formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 ? 
            [{
              _id: 'preview',
              name: formData.name || 'New Bin',
              address: formData.address,
              location: formData.location,
              capacityLitres: formData.capacityLitres,
              status: formData.status,
              type: formData.type
            }] : []}
          showAllMarkersOnLoad={formData.location && formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0}
          centerCoordinates={formData.location && formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 ? 
            [formData.location.coordinates[1], formData.location.coordinates[0]] : null}
          zoom={formData.location && formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 ? 15 : 10}
        />
      </div>

      {/* Form Panel */}
      <div className="bg-white shadow-lg relative">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-4">
          <h2 className="font-['Karla'] font-semibold text-[20px] text-[#086214] mb-4">
            Bin Details
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Bin Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              icon={<CapacityIcon />}
              required
            />

            <AddressInput
              placeholder="Address"
              value={formData.address}
              onAddressSelect={(addressData) => {
                if (addressData) {
                  setFormData(prev => ({
                    ...prev,
                    address: addressData.formattedAddress,
                    location: {
                      type: 'Point',
                      coordinates: addressData.coordinates // [lng, lat]
                    }
                  }));
                }
              }}
              icon={<LocationIcon />}
            />

            <FormInput
              type="number"
              placeholder="Capacity (L)"
              value={formData.capacityLitres}
              onChange={(e) => handleChange('capacityLitres', e.target.value)}
              icon={<CapacityIcon />}
              required
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
                <option value="normal">Normal</option>
                <option value="needs_pickup">Needs Pickup</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              >
                <option value="general">General Waste</option>
                <option value="recycle">Recycling</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <GreenButton
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : isEditing ? 'UPDATE BIN' : 'SAVE BIN'}
              </GreenButton>
              
              <GreenButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/bins')}
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