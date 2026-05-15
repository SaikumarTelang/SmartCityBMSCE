import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { collection, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import { db } from '../firebase';
import { getReports } from '../api/client';
import { getCurrentPosition } from '../utils/geo';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => { map.setView(position, 15); }, [position, map]);
  return null;
}

export default function MapPage() {
  const [pos, setPos] = useState([12.9716, 77.5946]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getCurrentPosition().then((p) => setPos([p.lat, p.lng])).catch(() => {});
    if (db) {
      return onSnapshot(collection(db, 'reports'), (snap) => {
        setReports(snap.docs.map((d) => {
          const data = d.data();
          const loc = data.location;
          return { id: d.id, ...data, location: loc?.latitude != null ? { lat: loc.latitude, lng: loc.longitude } : null };
        }));
      });
    }
    getReports().then(setReports);
  }, []);

  return (
    <div className="map-page-full" style={{ position: 'relative' }}>
      <Link to="/dashboard" className="map-back-btn">← Dashboard</Link>
      <MapContainer center={pos} zoom={14} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter position={pos} />
        <Marker position={pos}><Popup>You are here (GPS)</Popup></Marker>
        {reports.map((r) => r.location && (
          <Marker key={r.id} position={[r.location.lat, r.location.lng]}>
            <Popup><strong>{r.category}</strong><br />Votes: {r.votes}<br />Score: {r.weightScore}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
