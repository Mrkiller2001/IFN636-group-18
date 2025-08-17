import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import BinForm from '../components/BinForm';
import BinList from '../components/BinList';

export default function Bins() {
  const { user } = useAuth();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editingBin, setEditingBin] = useState(null);

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
    const t = setInterval(load, 15000); // refresh periodically (optional)
    return () => clearInterval(t);
  }, [load]);

  const handleSaved = () => load();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Bins</h1>
        <button
          onClick={load}
          className="text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <BinForm
        editingBin={editingBin}
        setEditingBin={setEditingBin}
        onSaved={handleSaved}
      />

      {loading && <div className="text-gray-500">Loading…</div>}
      {err && <div className="text-red-600 mb-3">Error: {err}</div>}

      {!loading && (
        <BinList bins={bins} setBins={setBins} setEditingBin={setEditingBin} />
      )}
    </div>
  );
}
