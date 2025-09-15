import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';

export default function Alerts() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // If backend provides an alerts list endpoint via dashboard, reuse:
        const { data } = await api.get('/dashboard');
        setAlerts(data?.alerts || []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-gray-600">Real-time alerts and observations. AI risk zones optional.</p>
      </div>

      <Card className="p-4">
        {alerts.length === 0 ? (
          <div className="text-gray-600 text-sm">No alerts at the moment.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {alerts.map((a, idx) => (
              <li key={idx} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title || a.type || 'Alert'}</div>
                    <div className="text-sm text-gray-600">{a.note || a.message}</div>
                    <div className="text-xs text-gray-400 mt-1">Bear: {a.bear_id || '—'} • {a.time || a.timestamp || ''}</div>
                  </div>
                  <div className="text-xs text-red-600">{a.severity || ''}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-4 mt-6">
        <div className="font-semibold mb-2">AI Risk Zones (Optional)</div>
        <p className="text-sm text-gray-600">
          This panel can visualize high-risk areas based on recent movement and proximity to human settlements.
          Integrate a heatmap or polygon overlays on the map in future iterations.
        </p>
      </Card>
    </div>
  );
}
