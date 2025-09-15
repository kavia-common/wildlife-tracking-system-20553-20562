import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon paths for Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl; // eslint-disable-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

/**
 * PUBLIC_INTERFACE
 * MapView renders a map with bear locations and optional movement polyline.
 * props:
 * - center: [lat, lng]
 * - zoom: number
 * - bears: [{ id, name, lat, lng, status }]
 * - history: [[lat, lng], ...] polyline
 * - height: CSS height class (e.g., 'h-[480px]')
 */
export default function MapView({ center = [20.5937, 78.9629], zoom = 5, bears = [], history = [], height = 'h-[480px]' }) {
  return (
    <div className={`ocean-card overflow-hidden ${height}`}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(bears) &&
          bears.map((b) => (
            <Marker key={b.id} position={[b.lat, b.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{b.name || `Bear #${b.id}`}</div>
                  <div className="text-gray-600">Status: {b.status || 'unknown'}</div>
                  <div className="text-gray-600">
                    Coords: {b.lat?.toFixed(4)}, {b.lng?.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        {Array.isArray(history) && history.length > 1 && (
          <Polyline positions={history} color="#2563EB" />
        )}
      </MapContainer>
    </div>
  );
}
