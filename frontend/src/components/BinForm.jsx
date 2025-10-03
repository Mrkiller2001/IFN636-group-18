import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const empty = {
  name: '',
  type: 'general',
  capacityLitres: '',
  lat: '',
  lng: '',
  installedAt: ''
};

export default function BinForm({ editingBin, setEditingBin, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingBin) {
      setForm({
        name: editingBin.name || '',
        type: editingBin.type || 'general',
        capacityLitres: editingBin.capacityLitres ?? '',
        lat: editingBin.location?.lat ?? '',
        lng: editingBin.location?.lng ?? '',
        installedAt: editingBin.installedAt
          ? new Date(editingBin.installedAt).toISOString().slice(0, 10)
          : ''
      });
    } else {
      setForm(empty);
    }
  }, [editingBin]);

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        capacityLitres: Number(form.capacityLitres),
        location: { lat: Number(form.lat), lng: Number(form.lng) },
        installedAt: form.installedAt || undefined
      };

      const headers = { Authorization: `Bearer ${user.token}` };

      let res;
      if (editingBin?._id) {
        res = await axiosInstance.put(`/api/bins/${editingBin._id}`, payload, { headers });
      } else {
        res = await axiosInstance.post('/api/bins', payload, { headers });
      }
      onSaved(res.data);
      setEditingBin(null);
      setForm(empty);
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">{editingBin ? 'Edit Bin' : 'Add Bin'}</h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Type</label>
          <select
            className="w-full border rounded p-2"
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
          >
            <option value="general">General</option>
            <option value="recycle">Recycle</option>
            <option value="organic">Organic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Capacity (L)</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Capacity (L)"
            type="number"
            min="1"
            value={form.capacityLitres}
            onChange={(e) => update('capacityLitres', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Installed Date</label>
          <input
            className="w-full border rounded p-2"
            type="date"
            value={form.installedAt}
            onChange={(e) => update('installedAt', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Latitude</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Latitude"
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => update('lat', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Longitude</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Longitude"
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => update('lng', e.target.value)}
            required
          />
        </div>

        <div className="col-span-full flex gap-2 mt-1">
          <button
            disabled={saving}
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded hover:opacity-95 disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingBin ? 'Update Bin' : 'Add Bin'}
          </button>
          {editingBin && (
            <button
              type="button"
              onClick={() => setEditingBin(null)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
              <label className="block text-sm text-gray-600 mb-1">Longitude</label>
