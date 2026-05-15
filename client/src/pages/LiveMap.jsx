import { MapPin, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ updateAuth }) {
  const position = [12.9716, 77.5946];

  const markers = [
    { id: 1, position: [12.9716, 77.5946], type: 'Pothole', status: 'In Progress' },
    { id: 2, position: [12.9750, 77.6000], type: 'Garbage', status: 'New' },
    { id: 3, position: [12.9680, 77.5850], type: 'Streetlight', status: 'Resolved' },
  ];

  return (
    <div className="h-full flex flex-col">
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Live Map</h1>
                <p className="text-slate-500">Track infrastructure issues across the city</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search location..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-slate-900 mb-1">{marker.type}</h3>
                    <p className={`text-sm font-medium ${
                      marker.status === 'Resolved' ? 'text-emerald-600' : 
                      marker.status === 'In Progress' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {marker.status}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
  );
}
