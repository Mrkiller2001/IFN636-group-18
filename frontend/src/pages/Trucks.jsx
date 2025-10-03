import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
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
    <MobileLayout title="Waste Manager">
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
    </MobileLayout>
  );
}