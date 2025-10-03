import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import FormInput from '../components/UI/FormInput';
import MapComponent from '../components/Map/MapComponent';
import AddressInput from '../components/AddressInput';

export default function RouteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bins, setBins] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    depot: {
      coordinates: [-74.006, 40.7128], // Default NYC [lng, lat]
      address: ''
    },
    assignedTruck: '',
    threshold: 80,
    maxStops: 10,
    scheduledDate: '',
    status: 'planned'
  });

  useEffect(() => {
    // Fetch bins and trucks for selection
    const fetchData = async () => {
      try {
        const [binsRes, trucksRes] = await Promise.all([
          axiosInstance.get('/api/bins', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axiosInstance.get('/api/trucks', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);
        setBins(binsRes.data);
        setTrucks(trucksRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();

    // Fetch route data if editing
    if (isEditing) {
      const fetchRoute = async () => {
        try {
          const { data } = await axiosInstance.get(`/api/routes/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setFormData({
            name: data.name || '',
            truckId: data.truckId || '',
            bins: data.bins?.map(bin => bin._id) || [],
            scheduledDate: data.scheduledDate ? 
              new Date(data.scheduledDate).toISOString().split('T')[0] : '',
            status: data.status || 'planned'
          });
        } catch (err) {
          setError('Failed to load route data');
        }
      };
      fetchRoute();
    }
  }, [id, isEditing, user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name) {
        setError('Route name is required');
        return;
      }
      
      if (!formData.depot.address) {
        setError('Depot address is required');
        return;
      }

      if (!formData.depot.coordinates || !Array.isArray(formData.depot.coordinates) || formData.depot.coordinates.length !== 2) {
        setError('Please select a valid depot address to get coordinates');
        return;
      }

      const routeData = {
        name: formData.name,
        depot: {
          type: 'Point',
          coordinates: formData.depot.coordinates,
          address: formData.depot.address
        },
        threshold: formData.threshold,
        maxStops: formData.maxStops,
        assignedTruck: formData.assignedTruck || undefined,
        scheduledDate: formData.scheduledDate || undefined
      };

      console.log('Submitting route data:', routeData);
      console.log('Depot coordinates:', formData.depot.coordinates);

      const url = isEditing ? `/api/routes/${id}` : '/api/routes';
      const method = isEditing ? 'put' : 'post';

      await axiosInstance[method](url, routeData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      navigate('/routes');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save route');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // Icons
  const RouteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="2" y1="2" x2="22" y2="22"></line>
      <path d="M6.5 6.5C7 7 7.5 8 8 9s1.5 2 2 2 1.5-1 2-2 1-2 1.5-2.5"></path>
      <path d="M13.5 13.5C14 14 14.5 15 15 16s1.5 2 2 2 1.5-1 2-2 1-2 1.5-2.5"></path>
    </svg>
  );

  const TruckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16,8 20,8 23,11 23,16 16,16"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
  
  // Use TruckIcon to avoid unused variable warning
  console.log('TruckIcon available for future use:', typeof TruckIcon);

  return (
    <MobileLayout title={isEditing ? 'Edit Route' : 'Add Route'}>
      {/* Map showing depot location */}
      <div className="h-[420px]">
        <MapComponent
          bins={bins.filter(bin => bin.latestFillPct >= formData.threshold || bin.status === 'needs_pickup')}
          trucks={formData.assignedTruck ? trucks.filter(t => t._id === formData.assignedTruck) : []}
          routes={[]}
          center={formData.depot.coordinates}
          zoom={13}
          height="420px"
          interactive={true}
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
            Route Details
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              placeholder="Route Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              icon={<RouteIcon />}
              required
            />

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Depot Address
              </label>
              <AddressInput
                placeholder="Enter depot address"
                value={formData.depot.address}
                onAddressSelect={(addressData) => {
                  if (addressData) {
                    setFormData(prev => ({
                      ...prev,
                      depot: {
                        address: addressData.formattedAddress,
                        coordinates: addressData.coordinates // [lng, lat]
                      }
                    }));
                  }
                }}
                className="w-full bg-neutral-100 h-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Assign Truck
              </label>
              <select
                value={formData.assignedTruck}
                onChange={(e) => handleChange('assignedTruck', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              >
                <option value="">Select Truck (Optional)</option>
                {trucks.filter(truck => truck.status === 'Available').map(truck => (
                  <option key={truck._id} value={truck._id}>
                    {truck.licensePlate}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                  Fill Threshold (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.threshold}
                  onChange={(e) => handleChange('threshold', parseInt(e.target.value))}
                  className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                  Max Stops
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxStops}
                  onChange={(e) => handleChange('maxStops', parseInt(e.target.value))}
                  className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Scheduled Date
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
                className="w-full bg-neutral-100 h-[28px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Kreon'] font-semibold text-[12px] text-gray-700"
              />
            </div>

            {/* Preview of bins that will be included */}
            <div className="space-y-2">
              <label className="font-['Kreon'] font-semibold text-[12px] text-gray-700">
                Bins to be included ({bins.filter(bin => bin.latestFillPct >= formData.threshold || bin.status === 'needs_pickup').length} bins)
              </label>
              <div className="max-h-[150px] overflow-y-auto border rounded p-2 bg-gray-50">
                {bins.filter(bin => bin.latestFillPct >= formData.threshold || bin.status === 'needs_pickup').map(bin => (
                  <div key={bin._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <span className="font-['Kreon'] text-[11px] text-gray-700">
                      {bin.address || `Bin ${bin._id.slice(-6)}`}
                    </span>
                    <div className="flex space-x-2 text-[10px]">
                      <span className={`px-2 py-1 rounded ${bin.status === 'needs_pickup' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {bin.status === 'needs_pickup' ? 'Needs Pickup' : `${bin.latestFillPct}% Full`}
                      </span>
                    </div>
                  </div>
                ))}
                {bins.filter(bin => bin.latestFillPct >= formData.threshold || bin.status === 'needs_pickup').length === 0 && (
                  <p className="text-gray-500 text-center py-4 font-['Kreon'] text-[12px]">
                    No bins meet the criteria (≥{formData.threshold}% full or needs pickup)
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <GreenButton
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : isEditing ? 'UPDATE ROUTE' : 'SAVE ROUTE'}
              </GreenButton>
              
              <GreenButton
                type="button"
                variant="secondary"
                onClick={() => navigate('/routes')}
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