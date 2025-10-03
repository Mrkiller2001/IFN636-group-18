import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MobileLayout from '../components/Layout/MobileLayout';
import GreenButton from '../components/UI/GreenButton';
import MapComponent from '../components/Map/MapComponent';

export default function BinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bin, setBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBin = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/bins/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBin(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load bin details');
      } finally {
        setLoading(false);
      }
    };

    fetchBin();
  }, [id, user.token]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      try {
        await axiosInstance.delete(`/api/bins/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        navigate('/bins');
      } catch (err) {
        alert('Failed to delete bin');
      }
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Bin Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading bin details...</div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Bin Details">
        <div className="p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <div className="mt-4">
            <GreenButton onClick={() => navigate('/bins')}>
              Back to Bins
            </GreenButton>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Bin Details">
      {/* Map showing bin location */}
      <div className="h-[420px]">
        <MapComponent
          bins={[bin]}
          trucks={[]}
          routes={[]}
          center={bin.location?.coordinates ? [bin.location.coordinates[0], bin.location.coordinates[1]] : [-74.006, 40.7128]}
          zoom={16}
          height="420px"
          interactive={true}
        />
      </div>

      {/* Bin Details Panel */}
      <div className="bg-white shadow-lg relative">
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-4 space-y-4">
          {/* Header with buttons */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-['Karla'] font-semibold text-[20px] text-[#086214]">
              Bin Details
            </h2>
            <div className="flex space-x-2">
              <GreenButton 
                size="sm" 
                onClick={() => navigate(`/bins/${id}/edit`)}
              >
                EDIT
              </GreenButton>
              <GreenButton 
                size="sm" 
                variant="secondary"
                onClick={handleDelete}
              >
                DELETE
              </GreenButton>
            </div>
          </div>

          {/* Bin Information */}
          <div className="space-y-3">
            <div>
              <label className="font-['Kreon'] font-semibold text-[14px] text-gray-700">Address</label>
              <p className="font-['Kreon'] text-[12px] text-gray-600">
                {bin?.address || 'No address specified'}
              </p>
            </div>

            <div>
              <label className="font-['Kreon'] font-semibold text-[14px] text-gray-700">Bin Status</label>
              <p className="font-['Kreon'] text-[12px] text-gray-600">
                {bin?.status || 'Unknown'}
              </p>
            </div>

            <div>
              <label className="font-['Kreon'] font-semibold text-[14px] text-gray-700">Bin Capacity</label>
              <p className="font-['Kreon'] text-[12px] text-gray-600">
                {bin?.capacity || 'N/A'}L
              </p>
            </div>

            <div>
              <label className="font-['Kreon'] font-semibold text-[14px] text-gray-700">Latest Fill%</label>
              <p className="font-['Kreon'] text-[12px] text-gray-600">
                {bin?.currentFillLevel || 0}%
              </p>
            </div>

            <div>
              <label className="font-['Kreon'] font-semibold text-[14px] text-gray-700">Last Read At</label>
              <p className="font-['Kreon'] text-[12px] text-gray-600">
                {bin?.lastSensorUpdate ? new Date(bin.lastSensorUpdate).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>

          {/* Fill History Chart Placeholder */}
          <div className="bg-gray-100 h-24 rounded-lg flex items-center justify-center mt-4">
            <div className="text-center">
              <p className="font-['Kreon'] font-semibold text-[14px] text-gray-600">Fill History</p>
              <div className="mt-2 flex justify-center space-x-2">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 bg-green-primary rounded-full"
                    style={{ height: `${Math.random() * 40 + 10}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}