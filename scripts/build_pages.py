from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "client" / "src" / "pages"

pages = {
"Splash.jsx": '''import { Link } from 'react-router-dom';

export default function Splash() {
  return (
    <motion className="portal-page">
      <motion>
        <motion className="portal-logo">🛡️</motion>
        <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>[CITY AI LOGO]</p>
        <h1 className="portal-title">CIVIC INFRASTRUCTURE TRACKER</h1>
        <p className="portal-sub">Smart Cities Through Citizen Reporting</p>
        <p className="portal-divider">— SELECT ACCESS PORTAL —</p>
        <Link to="/login" className="portal-card">
          <span className="portal-icon">👤</span>
          <motion>
            <h3>Citizen Login</h3>
            <p>Report potholes, utilities, or garbage clusters nearby.</p>
          </motion>
        </Link>
        <Link to="/admin" className="portal-card">
          <span className="portal-icon">🛡️</span>
          <motion>
            <h3>Operations Console</h3>
            <p>Review sorted severity weights and dispatch engineers.</p>
          </motion>
        </Link>
      </motion>
    </motion>
  );
}
''',
}

# Fix motion -> div in all content
for name, content in pages.items():
    fixed = content.replace("<motion", "<div").replace("</motion>", "</div>")
    (ROOT / name).write_text(fixed, encoding="utf-8")
    print("wrote", name)
