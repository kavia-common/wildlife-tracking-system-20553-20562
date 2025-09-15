import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';

export default function AddBear() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    tag_id: '',
    lat: '',
    lng: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      const payload = {
        name: form.name,
        tag_id: form.tag_id,
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        notes: form.notes
      };
      const { data } = await api.post('/bears', payload);
      nav(`/bears/${data?.id || ''}`);
    } catch (error) {
      setErr(error?.response?.data?.message || 'Failed to create bear');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Register Bear</h1>
      <Card className="p-6">
        {err && <div className="mb-4 text-error text-sm">{err}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" className="ocean-input" value={form.name} onChange={change} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Tag ID</label>
            <input name="tag_id" className="ocean-input" value={form.tag_id} onChange={change} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Latitude</label>
            <input name="lat" className="ocean-input" value={form.lat} onChange={change} placeholder="e.g. 20.5937" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude</label>
            <input name="lng" className="ocean-input" value={form.lng} onChange={change} placeholder="e.g. 78.9629" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Notes</label>
            <textarea name="notes" className="ocean-input min-h-[100px]" value={form.notes} onChange={change} />
          </div>
          <div className="md:col-span-2">
            <button disabled={submitting} className="ocean-btn-primary">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
