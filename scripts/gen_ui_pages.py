"""Generate UI pages with correct div tags."""
from pathlib import Path

P = Path(__file__).resolve().parents[1] / "client" / "src" / "pages"


def save(name: str, content: str):
    content = content.replace("MOTION", "div")
    (P / name).write_text(content, encoding="utf-8")
    print("wrote", name)


save("Splash.jsx", r"""import { Link } from 'react-router-dom';

export default function Splash() {
  return (
    <MOTION className="portal-page">
      <MOTION>
        <MOTION className="portal-logo">🛡️</MOTION>
        <p style={{ fontWeight: 800 }}>[CITY AI LOGO]</p>
        <h1 className="portal-title">CIVIC INFRASTRUCTURE TRACKER</h1>
        <p className="portal-sub">Smart Cities Through Citizen Reporting</p>
        <p className="portal-divider">— SELECT ACCESS PORTAL —</p>
        <Link to="/login" className="portal-card">
          <span className="portal-icon">👤</span>
          <MOTION><h3>Citizen Login</h3><p>Report potholes, utilities, or garbage clusters nearby.</p></MOTION>
        </Link>
        <Link to="/admin" className="portal-card">
          <span className="portal-icon">🛡️</span>
          <MOTION><h3>Operations Console</h3><p>Review sorted severity weights and dispatch engineers.</p></MOTION>
        </Link>
      </MOTION>
    </MOTION>
  );
}
""")

save("Login.jsx", r"""import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { registerUser } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailFor = (m) => `${m}@citizen.smartcity.app`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (signup && password !== confirm) throw new Error('Passwords do not match');
      const email = emailFor(mobile);
      const cred = signup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await registerUser({ uid, mobile, name: 'Citizen', email });
      localStorage.setItem('userId', uid);
      localStorage.setItem('mobile', mobile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MOTION className="auth-page">
      <MOTION className="auth-card">
        <span className="auth-badge">↩ {signup ? 'ACCOUNT SETUP' : 'WELCOME BACK'}</span>
        <h1>{signup ? 'Create Account' : 'Citizen Login'}</h1>
        <p className="auth-sub">
          {signup ? 'Sign up to report local infrastructure issues' : 'Access your civic tracking portal panel'}
        </p>
        {error && <MOTION className="error-box">{error}</MOTION>}
        <form onSubmit={handleSubmit}>
          <label className="field-label">MOBILE NUMBER</label>
          <MOTION className="field-wrap">
            <span className="field-icon">📱</span>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter 10-digit mobile" required />
          </MOTION>
          <label className="field-label">{signup ? 'CREATE PASSWORD' : 'PASSWORD'}</label>
          <MOTION className="field-wrap">
            <span className="field-icon">🔒</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          </MOTION>
          {signup && (
            <>
              <label className="field-label">CONFIRM PASSWORD</label>
              <MOTION className="field-wrap">
                <span className="field-icon">🔒</span>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-type password" required />
              </MOTION>
            </>
          )}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'PLEASE WAIT...' : signup ? 'REGISTER & ENTER' : 'LOGIN INSTANTLY'}
          </button>
        </form>
        <p className="auth-footer">
          {signup ? 'Already have an account? ' : 'New user? '}
          <a href="#" onClick={(e) => { e.preventDefault(); setSignup(!signup); }}>
            {signup ? 'Login here' : 'Register here'}
          </a>
        </p>
        <p className="auth-footer"><Link to="/">← Back to portal</Link></p>
      </MOTION>
    </MOTION>
  );
}
""")

save("Dashboard.jsx", r"""import { useEffect, useState } from 'react';
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

  const header = (
    <header className="citizen-header">
      <span className="loc">📍 Bengaluru Central</span>
      <span className="points">🏆 {points} Points</span>
    </header>
  );

  return (
    <CitizenShell header={header}>
      <MOTION className="dash-card">
        <h3>File Infrastructure Report</h3>
        <p>Upload an incident image to trigger automated AI classification checks.</p>
        <MOTION className="action-row">
          <button className="action-btn" onClick={() => navigate('/detect')}>☁️ Upload File</button>
          <button className="action-btn" onClick={() => navigate('/detect')}>📷 Open Camera</button>
        </MOTION>
      </MOTION>
      <MOTION className="dash-card">
        <h3>Live Dispatched Tickets</h3>
        <MOTION className="tag-row">
          <span className="tag red">Potholes</span>
          <span className="tag green">Garbage</span>
          <span className="tag yellow">Utilities</span>
        </MOTION>
        <span className="proximity-pill">📍 12m Proximity Lock Engine Engaged</span>
      </MOTION>
      <MOTION className="dash-card">
        <h3>Verified Civic Resolutions</h3>
        <p>✅ RESOLVED — Pothole fix finalized near MG Road intersection.</p>
      </MOTION>
    </CitizenShell>
  );
}
""")

save("Detection.jsx", r"""import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenShell from '../components/CitizenShell';
import { detectImage, submitReport, getCurrentPosition } from '../api/client';

export default function Detection() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    getCurrentPosition().then(setLocation).catch(() => setError('Enable GPS for auto location tagging'));
  }, []);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const runAI = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      setResult(await detectImage(file));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    if (!result || result.category === 'Unknown') return;
    setSubmitting(true);
    try {
      const loc = location || (await getCurrentPosition());
      const res = await submitReport({
        category: result.category,
        severity: result.severity,
        location: loc,
        userId,
        aiConfidence: result.confidence,
        detections: result.detections,
        imagePreview: preview,
        address: 'Bengaluru Central',
      });
      if (res.isDuplicate) {
        navigate('/duplicates', { state: res });
      } else {
        navigate('/tracking', { state: { ticketId: res.ticketId || res.id } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const header = <header className="citizen-header"><span>AI Computer Vision Scan</span></header>;

  return (
    <CitizenShell header={header}>
      <MOTION className="dash-card">
        <input type="file" accept="image/*" capture="environment" onChange={onFile} />
        {preview && (
          <MOTION className="ai-badges">
            <img src={preview} alt="scan" className="detect-preview" />
            {result?.detections?.map((d) => (
              <span key={d.type} className={`badge-overlay ${d.type.includes('Garbage') ? 'garbage' : 'pothole'}`}>
                {d.type} {(d.confidence * 100).toFixed(0)}%
              </span>
            ))}
          </MOTION>
        )}
        {location && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 GPS locked: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
        {result && (
          <MOTION style={{ marginTop: '1rem' }}>
            <p>Best: <strong>{result.category}</strong></p>
            <p className="severity-high">Severity: {result.severity}</p>
            <p>Priority: EMERGENCY DISPATCH</p>
          </MOTION>
        )}
        <MOTION className="action-row" style={{ marginTop: '1rem' }}>
          <button className="btn-outline" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>↻ Retake</button>
          <button className="btn-green" onClick={confirm} disabled={!result || submitting}>✓ Confirm Report</button>
        </MOTION>
        <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={runAI} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Run AI Scan'}
        </button>
        {error && <MOTION className="error-box">{error}</MOTION>}
      </MOTION>
    </CitizenShell>
  );
}
""")

save("Duplicates.jsx", r"""import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { upvoteReport } from '../api/client';

export default function Duplicates() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(state?.votes || 8);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  const upvote = async () => {
    setLoading(true);
    try {
      const res = await upvoteReport(state.reportId, userId);
      setVotes(res.votes);
      navigate('/dashboard');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MOTION className="dup-page">
      <header className="dup-header">⚠ Spatial Proximity Engine</header>
      <MOTION className="dup-card">
        <h2>Similar Reports Found</h2>
        <MOTION className="tag-row">
          <span className="tag red">{state?.category || 'Pothole'} {state?.distanceMeters || 12} meters away</span>
          <span className="tag" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{votes} Citizens Reported</span>
        </MOTION>
        <p style={{ margin: '1rem 0', color: '#475569' }}>
          An active ticket exists at this location. Upvoting increases priority for BBMP field crews.
        </p>
        <button className="btn-primary" onClick={upvote} disabled={loading}>
          {loading ? 'Upvoting...' : 'Upvote & Join Existing Report'}
        </button>
        <button className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/dashboard')}>
          + Create Separate New Report
        </button>
      </MOTION>
    </MOTION>
  );
}
""")

save("Tracking.jsx", r"""import { useLocation, Link } from 'react-router-dom';

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
    <MOTION style={{ minHeight: '100vh', background: '#f8fafc', padding: '1rem' }}>
      <MOTION style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Link to="/dashboard">← Dashboard</Link>
        <span style={{ background: '#fef9c3', padding: '0.25rem 0.75rem', borderRadius: 8 }}>{ticket}</span>
      </MOTION>
      <MOTION className="dash-card">
        <p style={{ fontSize: '0.7rem', color: '#64748b' }}>INFRASTRUCTURE LIFECYCLE</p>
        <h2>Ticket Node Progress</h2>
        {STEPS.map((s) => (
          <MOTION key={s.title} style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0' }}>
            <span>{s.done ? '✅' : '○'}</span>
            <MOTION><strong>{s.title}</strong><p style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.desc}</p></MOTION>
          </MOTION>
        ))}
        <Link to="/map" className="btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>RETURN TO LIVE MAP</Link>
      </MOTION>
    </MOTION>
  );
}
""")

save("Milestones.jsx", r"""import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CitizenShell from '../components/CitizenShell';
import { getUser } from '../api/client';

export default function Milestones() {
  const [profile, setProfile] = useState({ points: 320, rank: 'Level 3' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) getUser(userId).then(setProfile).catch(() => {});
  }, [userId]);

  const header = (
    <header className="citizen-header">
      <Link to="/dashboard" style={{ color: '#fff' }}>← Dashboard</Link>
      <span className="points">🏆 {profile.points} Total Pts</span>
    </header>
  );

  return (
    <CitizenShell header={header}>
      <MOTION className="dash-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '2rem' }}>🏅</p>
        <h2>Citizen Rank: {profile.rank}</h2>
        <p style={{ color: '#64748b' }}>Top 12% of Bengaluru Contributors</p>
      </MOTION>
      <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '0.8rem', color: '#64748b' }}>UNLOCKED MILESTONES</h3>
      <MOTION className="dash-card">🛡️ Pothole Pioneer — First verified road report <span style={{ float: 'right', color: '#16a34a' }}>✓ Active</span></MOTION>
      <MOTION className="dash-card">🌿 Eco Citizen — 5 garbage cluster reports <span style={{ float: 'right', color: '#16a34a' }}>✓ Active</span></MOTION>
      <MOTION className="dash-card" style={{ opacity: 0.6 }}>⭐ Civic Elite — 500+ points <span style={{ float: 'right' }}>🔒 Locked</span></MOTION>
    </CitizenShell>
  );
}
""")

save("AdminLogin.jsx", r"""import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState('admin');
  const [pass, setPass] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else alert('Invalid credentials');
  };

  return (
    <MOTION className="admin-page">
      <MOTION className="admin-card">
        <p style={{ fontSize: '2rem', textAlign: 'center' }}>🛡️</p>
        <h1 style={{ textAlign: 'center' }}>Command Control Portal</h1>
        <p style={{ textAlign: 'center', color: '#38bdf8', fontSize: '0.75rem', marginBottom: '1.5rem' }}>BBMP MUNICIPAL GOVERNANCE SECURITY LAYER</p>
        <form onSubmit={submit}>
          <label style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Officer ID / Username</label>
          <input style={{ margin: '0.5rem 0 1rem', background: '#0f172a', color: '#fff', border: '1px solid #2563eb' }} value={user} onChange={(e) => setUser(e.target.value)} />
          <label style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Clearance Password</label>
          <input type="password" style={{ margin: '0.5rem 0 1rem', background: '#0f172a', color: '#fff', border: '1px solid #2563eb' }} value={pass} onChange={(e) => setPass(e.target.value)} />
          <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '1rem', borderRadius: 8, fontWeight: 700 }}>AUTHORIZE & INITIALIZE CONSOLE</button>
        </form>
      </MOTION>
    </MOTION>
  );
}
""")

save("AdminDashboard.jsx", r"""import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, dispatchReport } from '../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('potholes');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') navigate('/admin');
    load();
  }, [tab, navigate]);

  const load = () => getAdminStats(tab).then(setReports).catch(console.error);

  const header = (
    <MOTION style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h1>🛡️ BBMP Operations Console</h1>
      <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>● SPATIAL DISPATCH ACTIVE</span>
    </MOTION>
  );

  return (
    <MOTION className="admin-dash">
      {header}
      <h2>Incident Analysis Core</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Tickets sorted by proximity cluster weight — highest impact first.
      </p>
      <MOTION style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['potholes', 'garbage', 'utilities'].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: tab === t ? '#ea580c' : '#334155', color: '#fff' }}>
            {t === 'potholes' ? 'Potholes' : t === 'garbage' ? 'Garbage Dumps' : 'Street Lights / Wires'}
          </button>
        ))}
      </MOTION>
      {reports.length === 0 && <p>No active tickets in this category.</p>}
      {reports.map((r, i) => (
        <MOTION key={r.id} className={`admin-ticket ${i === 0 ? 'critical' : ''}`}>
          {i === 0 && <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>CRITICAL QUEUE HEAD</p>}
          <MOTION style={{ display: 'flex', justifyContent: 'space-between' }}>
            <MOTION>
              <h3>{r.ticketId || r.id}</h3>
              <p style={{ color: '#94a3b8' }}>{r.address || 'Bengaluru'}</p>
            </MOTION>
            <MOTION className="weight-box">Weight<br />{r.weightScore}</MOTION>
          </MOTION>
          <p style={{ margin: '0.75rem 0' }}>{r.category} — {r.severity} — AI {((r.aiConfidence || 0) * 100).toFixed(0)}%</p>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>📍 {r.votes || 1} clustered submissions · Priority: {r.priority || 'Medium'}</p>
          <button onClick={() => dispatchReport(r.id).then(load)} style={{ marginTop: '0.75rem', background: '#16a34a', color: '#fff', padding: '0.65rem 1rem', borderRadius: 8, width: '100%' }}>
            Dispatch Engineers
          </button>
        </MOTION>
      ))}
    </MOTION>
  );
}
""")

save("MapPage.jsx", r"""import { useEffect, useState } from 'react';
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
    <MOTION className="map-page-full" style={{ position: 'relative' }}>
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
    </MOTION>
  );
}
""")

print("done batch 3")
