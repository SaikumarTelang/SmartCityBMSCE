import { useLocation, Link } from 'react-router-dom';

const STEPS = [
  { title: 'Reported', desc: 'Citizen ticket submitted via app coordinates.', done: true },
  { title: 'AI Verified', desc: 'Computer Vision confirmed confidence thresholds.', done: true },
  { title: 'Assigned', desc: 'Ticket routed to municipal field station.', done: true },
  { title: 'In Progress', desc: 'Maintenance crew dispatched to site.', done: false },
  { title: 'Fixed', desc: 'Resolution verified via follow-up photo.', done: false },
];

export default function Tracking() {
  const { state } = useLocation();
  const ticket = state?.ticketId || 'BBMP-2042';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Link to="/dashboard">← Dashboard</Link>
        <span style={{ background: '#fef9c3', padding: '0.25rem 0.75rem', borderRadius: 8 }}>{ticket}</span>
      </div>
      <div className="dash-card">
        <p style={{ fontSize: '0.7rem', color: '#64748b' }}>INFRASTRUCTURE LIFECYCLE</p>
        <h2>Ticket Node Progress</h2>
        {STEPS.map((s) => (
          <div key={s.title} style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0' }}>
            <span>{s.done ? '✅' : '○'}</span>
            <div><strong>{s.title}</strong><p style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.desc}</p></div>
          </div>
        ))}
        <Link to="/map" className="btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>RETURN TO LIVE MAP</Link>
      </div>
    </div>
  );
}
