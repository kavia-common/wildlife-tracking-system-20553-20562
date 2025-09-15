import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import MapView from '../components/MapView';
import Loading from '../components/ui/Loading';

export default function BearDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bear, setBear] = useState(null);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState({ lastHours: 24 });
  const [err, setErr] = useState(null);

  const fetchData = async () => {
    const [bRes, mRes] = await Promise.all([
      api.get(`/bears/${id}`),
      api.get(`/movements/${id}`, { params: { last_hours: filter.lastHours } })
    ]);
    setBear(bRes.data);
    setHistory(
      (mRes.data || []).map((m) => [m.lat ?? m.location?.lat, m.lng ?? m.location?.lng]).filter(Boolean)
    );
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
      } catch (e) {
        setErr('Failed to load bear detail');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, filter.lastHours]);

  const center = useMemo(() => {
    if (history?.length) return history[history.length - 1];
    if (bear?.location) return [bear.location.lat, bear.location.lng];
    return [20.5937, 78.9629];
  }, [history, bear]);

  const deleteBear = async () => {
    if (!confirm('Delete this bear?')) return;
    try {
      await api.delete(`/bears/${id}`);
      nav('/dashboard');
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{bear?.name || `Bear #${id}`}</h1>
          <p className="text-gray-600 text-sm">Tag: {bear?.tag_id || '—'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/bears/${id}/edit`} className="ocean-btn">Edit</Link>
          <button onClick={deleteBear} className="ocean-btn bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
        </div>
      </div>

      {err && <div className="mb-3 text-error text-sm">{err}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Movement History</div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Last (hrs)</label>
                <select
                  className="ocean-input w-28"
                  value={filter.lastHours}
                  onChange={(e) => setFilter((f) => ({ ...f, lastHours: Number(e.target.value) }))}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={72}>72</option>
                </select>
              </div>
            </div>
            <MapView center={center} zoom={8} bears={[{ id, name: bear?.name, lat: center[0], lng: center[1], status: bear?.status }]} history={history} height="h-[420px]" />
          </Card>

          <Card className="p-4">
            <div className="font-semibold mb-2">Environment Overlays</div>
            <p className="text-sm text-gray-600">
              Visual overlays for habitat, vegetation, water sources can be integrated here.
              (Placeholder for optional layers)
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="font-semibold mb-2">Details</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Status: {bear?.status || 'unknown'}</div>
              <div>Last Seen: {bear?.last_seen || '—'}</div>
              <div>Coords: {(bear?.location?.lat ?? 0).toFixed?.(4)}, {(bear?.location?.lng ?? 0).toFixed?.(4)}</div>
              <div className="text-gray-600 mt-2">{bear?.notes}</div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="font-semibold mb-2">Activity</div>
            <div className="text-sm text-gray-600">
              Activity charts (roaming vs stationary time) can be rendered here using a chart library.
              (Placeholder)
            </div>
          </Card>

          <Card className="p-4">
            <div className="font-semibold mb-2">Manual Observation</div>
            <ObservationForm bearId={id} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function ObservationForm({ bearId }) {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.post('/alerts', { bear_id: bearId, note, type: 'observation' });
      setNote('');
      setMsg('Observation logged.');
    } catch {
      setMsg('Failed to log observation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
      <textarea
        className="ocean-input min-h-[100px]"
        placeholder="Enter field notes or observations..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button disabled={saving} className="ocean-btn-primary">
        {saving ? 'Saving...' : 'Log Observation'}
      </button>
    </form>
  );
}
