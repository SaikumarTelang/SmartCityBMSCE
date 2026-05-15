import { useState } from 'react';
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
    <div className="dup-page">
      <header className="dup-header">⚠ Spatial Proximity Engine</header>
      <div className="dup-card">
        <h2>Similar Reports Found</h2>
        <div className="tag-row">
          <span className="tag red">{state?.category || 'Pothole'} {state?.distanceMeters || 12} meters away</span>
          <span className="tag" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{votes} Citizens Reported</span>
        </div>
        <p style={{ margin: '1rem 0', color: '#475569' }}>
          An active ticket exists at this location. Upvoting increases priority for BBMP field crews.
        </p>
        <button className="btn-primary" onClick={upvote} disabled={loading}>
          {loading ? 'Upvoting...' : 'Upvote & Join Existing Report'}
        </button>
        <button className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/dashboard')}>
          + Create Separate New Report
        </button>
      </div>
    </div>
  );
}
