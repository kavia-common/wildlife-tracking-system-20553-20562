import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Stat from '../components/ui/Stat';
import Loading from '../components/ui/Loading';
import MapView from '../components/MapView';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [bears, setBears] = useState([]);

  const fetchData = async () => {
    const [dRes, bRes] = await Promise.all([
      api.get('/dashboard'),
      api.get('/bears')
    ]);
    setSummary(dRes.data);
    setBears(bRes.data || []);
  };

  useEffect(() => {
    let timer;
    (async () => {
      try {
        await fetchData();
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();

    // poll for live updates every 10s
    timer = setInterval(async () => {
      try {
        await fetchData();
      } catch {
        // silent
      }
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const mapBears = useMemo(
    () =>
      (bears || []).map((b) => ({
        id: b.id,
        name: b.name,
        lat: b.location?.lat ?? b.lat ?? 0,
        lng: b.location?.lng ?? b.lng ?? 0,
        status: b.status
      })),
    [bears]
  );

  const center = useMemo(() => {
    if (mapBears.length > 0) {
      return [mapBears[0].lat || 20, mapBears[0].lng || 78];
    }
    return [20.5937, 78.9629];
  }, [mapBears]);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Live overview of tracked bears and movement status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Tracked Bears" value={summary?.total_bears ?? bears.length} accent="blue" />
        <Stat label="Active (Roaming)" value={summary?.roaming ?? (bears.filter(b => b.status === 'roaming').length)} accent="amber" />
        <Stat label="Stationary" value={summary?.stationary ?? (bears.filter(b => b.status === 'stationary').length)} accent="green" />
        <Stat label="Alerts (24h)" value={summary?.alerts_24h ?? 0} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView center={center} zoom={6} bears={mapBears} />
        </div>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Tracked Animals</h2>
            <Link to="/bears/new" className="ocean-btn-secondary text-sm">Add</Link>
          </div>
          <div className="space-y-3 max-h-[460px] overflow-auto pr-1">
            {(bears || []).map((b) => (
              <Link to={`/bears/${b.id}`} key={b.id} className="block p-3 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.name || `Bear #${b.id}`}</div>
                    <div className="text-xs text-gray-500">
                      Last seen: {b.last_seen || '—'} • Coords: {(b.location?.lat ?? b.lat)?.toFixed?.(3)},{' '}
                      {(b.location?.lng ?? b.lng)?.toFixed?.(3)}
                    </div>
                  </div>
                  <Badge color={b.status === 'roaming' ? 'amber' : b.status === 'stationary' ? 'green' : 'blue'}>
                    {b.status || 'unknown'}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
