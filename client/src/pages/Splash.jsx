import { Link } from 'react-router-dom';

export default function Splash() {
  return (
    <div className="portal-page">
      <div>
        <div className="portal-logo">🛡️</div>
        <p style={{ fontWeight: 800 }}>[CITY AI LOGO]</p>
        <h1 className="portal-title">CIVIC INFRASTRUCTURE TRACKER</h1>
        <p className="portal-sub">Smart Cities Through Citizen Reporting</p>
        <p className="portal-divider">— SELECT ACCESS PORTAL —</p>
        <Link to="/login" className="portal-card">
          <span className="portal-icon">👤</span>
          <div><h3>Citizen Login</h3><p>Report potholes, utilities, or garbage clusters nearby.</p></div>
        </Link>
        <Link to="/admin" className="portal-card">
          <span className="portal-icon">🛡️</span>
          <div><h3>Operations Console</h3><p>Review sorted severity weights and dispatch engineers.</p></div>
        </Link>
      </div>
    </div>
  );
}
