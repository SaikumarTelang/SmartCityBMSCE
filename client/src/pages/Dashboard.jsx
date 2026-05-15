import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenShell from '../components/CitizenShell';
import { getUser } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(320);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    getUser(userId).then((u) => setPoints(u.points || 320)).catch(() => {});
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('mobile');
    navigate('/login');
  };

  const header = (
    <header className="citizen-header">
      <span className="loc">📍 Bengaluru Central</span>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span className="points">🏆 {points} Points</span>
        <button onClick={handleLogout} style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '0.5rem 1rem',
          borderRadius: '999px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          Logout
        </button>
      </div>
    </header>
  );

  return (
    <CitizenShell header={header}>
      <div className="dash-card">
        <h3>File Infrastructure Report</h3>
        <p>Upload an incident image to trigger automated AI classification checks.</p>
        <div className="action-row">
          <button className="action-btn" onClick={() => navigate('/detect')}>☁️ Upload File</button>
          <button className="action-btn" onClick={() => navigate('/detect')}>📷 Open Camera</button>
        </div>
      </div>
      <div className="dash-card">
        <h3>Live Dispatched Tickets</h3>
        <div className="tag-row">
          <span className="tag red">Potholes</span>
          <span className="tag green">Garbage</span>
          <span className="tag yellow">Utilities</span>
        </div>
        <span className="proximity-pill">📍 12m Proximity Lock Engine Engaged</span>
      </div>
      <div className="dash-card">
        <h3>Verified Civic Resolutions</h3>
        <p>✅ RESOLVED — Pothole fix finalized near MG Road intersection.</p>
      </div>
    </CitizenShell>
  );
}
