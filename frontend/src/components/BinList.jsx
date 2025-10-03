import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import FillBadge from './FillBadge';
import { Link } from 'react-router-dom';

export default function BinList({ bins, setBins, setEditingBin }) {
  const { user } = useAuth();

  const remove = async (id) => {
    if (!window.confirm('Delete this bin?')) return;
    try {
      await axiosInstance.delete(`/api/bins/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBins((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

const simulateFill = async (b, value = 85) => {
  try {
    await axiosInstance.post('/api/sensor-readings', {
      binId: b._id,
      fillPct: value,
      batteryPct: 60
    }, { headers: { Authorization: `Bearer ${user.token}` } });

    // Update the row locally so you see it immediately
    setBins(prev => prev.map(x => x._id === b._id
      ? { ...x, latestFillPct: value, status: value >= 80 ? 'needs_pickup' : 'normal', latestReadingAt: new Date().toISOString() }
      : x
    ));
  } catch (e) {
    alert(e?.response?.data?.message || e.message || 'Failed to add reading');
  }
};


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bins.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8 bg-white shadow rounded">
          No bins yet.
        </div>
      )}

      {bins.map((b) => (
        <div key={b._id} className="bg-white shadow rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{b.name}</h3>
                <div className="text-sm text-gray-500 capitalize">{b.type}</div>
              </div>
              <div className="ml-4">
                <FillBadge value={b.latestFillPct} />
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <div>Capacity: <span className="font-medium">{b.capacityLitres} L</span></div>
              <div className={`mt-1 ${b.status === 'needs_pickup' ? 'text-red-600 font-medium' : ''}`}>Status: {b.status}</div>
              <div className="mt-1">Last reading: {b.latestReadingAt ? new Date(b.latestReadingAt).toLocaleString() : '-'}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link to={`/bins/${b._id}/history`} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">History</Link>
            <button onClick={() => setEditingBin(b)} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Edit</button>
            <button onClick={() => simulateFill(b, 85)} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Mark 85%</button>
            <button onClick={() => remove(b._id)} className="ml-auto text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
