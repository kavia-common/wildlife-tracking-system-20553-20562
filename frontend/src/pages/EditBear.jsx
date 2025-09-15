import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';

export default function EditBear() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    tag_id: '',
    lat: '',
    lng: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/bears/${id}`);
        setForm({
          name: data.name || '',
          tag_id: data.tag_id || '',
          lat: data.location?.lat ?? data.lat ?? '',
          lng: data.location?.lng ?? data.lng ?? '',
          notes: data.notes || ''
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
      await api.put(`/bears/${id}`, payload);
      nav(`/bears/${id}`);
    } catch (error) {
      setErr(error?.response?.data?.message || 'Failed to update bear');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Bear</h1>
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
            <input name="lat" className="ocean-input" value={form.lat} onChange={change} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Longitude</label>
            <input name="lng" className="ocean-input" value={form.lng} onChange={change} required />
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
