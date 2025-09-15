import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import Badge from '../components/ui/Badge';

export default function BearsList() {
  const [loading, setLoading] = useState(true);
  const [bears, setBears] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/bears');
        setBears(data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Bears</h1>
        <Link to="/bears/new" className="ocean-btn-primary">Add Bear</Link>
      </div>
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(bears || []).map((b) => (
            <Link to={`/bears/${b.id}`} key={b.id} className="p-4 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-soft transition">
              <div className="font-semibold">{b.name || `Bear #${b.id}`}</div>
              <div className="text-sm text-gray-600">ID: {b.id}</div>
              <div className="mt-2">
                <Badge color={b.status === 'roaming' ? 'amber' : b.status === 'stationary' ? 'green' : 'blue'}>
                  {b.status || 'unknown'}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last seen: {b.last_seen || '—'}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
