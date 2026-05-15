import { useEffect, useState } from 'react';
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
      <div className="dash-card">
        <input type="file" accept="image/*" capture="environment" onChange={onFile} />
        {preview && (
          <div className="ai-badges">
            <img src={preview} alt="scan" className="detect-preview" />
            {result?.detections?.map((d) => (
              <span key={d.type} className={`badge-overlay ${d.type.includes('Garbage') ? 'garbage' : 'pothole'}`}>
                {d.type} {(d.confidence * 100).toFixed(0)}%
              </span>
            ))}
          </div>
        )}
        {location && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 GPS locked: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
        {result && (
          <div style={{ marginTop: '1rem' }}>
            <p>Best: <strong>{result.category}</strong></p>
            <p className="severity-high">Severity: {result.severity}</p>
            <p>Priority: EMERGENCY DISPATCH</p>
          </div>
        )}
        <div className="action-row" style={{ marginTop: '1rem' }}>
          <button className="btn-outline" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>↻ Retake</button>
          <button className="btn-green" onClick={confirm} disabled={!result || submitting}>✓ Confirm Report</button>
        </div>
        <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={runAI} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Run AI Scan'}
        </button>
        {error && <div className="error-box">{error}</div>}
      </div>
    </CitizenShell>
  );
}
