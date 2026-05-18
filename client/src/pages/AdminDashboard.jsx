import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, TrendingUp, LogOut, Building2, User } from 'lucide-react';
import { getAdminStats, dispatchReport } from '../api/client';

const getAreaName = (location) => {
  if (!location) return 'Unknown Location';
  const latLngMatch = location.match(/Lat:\s*([\d.-]+),\s*Lng:\s*([\d.-]+)/);
  if (latLngMatch) {
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[2]);
    
    if (lat >= 12.968 && lat <= 12.975 && lng >= 77.595 && lng <= 77.605) {
      return 'MG Road';
    }
    if (lat >= 12.970 && lat <= 12.980 && lng >= 77.610 && lng <= 77.620) {
      return 'Indiranagar';
    }
    if (lat >= 12.960 && lat <= 12.975 && lng >= 77.575 && lng <= 77.590) {
      return 'Koramangala';
    }
    if (lat >= 12.915 && lat <= 12.930 && lng >= 77.605 && lng <= 77.620) {
      return 'HSR Layout';
    }
    if (lat >= 12.935 && lat <= 12.950 && lng >= 77.585 && lng <= 77.595) {
      return 'Jayanagar';
    }
    if (lat >= 12.905 && lat <= 12.925 && lng >= 77.588 && lng <= 77.610) {
      return 'BTM Layout';
    }
    if (lat >= 12.985 && lat <= 12.995 && lng >= 77.580 && lng <= 77.595) {
      return 'Sadashivnagar';
    }
    if (lat >= 12.955 && lat <= 12.970 && lng >= 77.630 && lng <= 77.650) {
      return 'Whitefield';
    }
    if (lat >= 13.005 && lat <= 13.025 && lng >= 77.560 && lng <= 77.575) {
      return 'Hebbal';
    }
    if (lat >= 12.925 && lat <= 12.940 && lng >= 77.560 && lng <= 77.575) {
      return 'Banashankari';
    }
    if (lat >= 12.940 && lat <= 12.955 && lng >= 77.635 && lng <= 77.655) {
      return 'Marathahalli';
    }
    if (lat >= 12.900 && lat <= 12.920 && lng >= 77.630 && lng <= 77.645) {
      return 'Electronic City';
    }
    if (lat >= 12.945 && lat <= 12.960 && lng >= 77.615 && lng <= 77.630) {
      return 'HAL';
    }
    if (lat >= 12.950 && lat <= 12.965 && lng >= 77.570 && lng <= 77.585) {
      return 'Shanthinagar';
    }
    if (lat >= 12.920 && lat <= 12.935 && lng >= 77.570 && lng <= 77.585) {
      return 'Basavanagudi';
    }
    if (lat >= 12.910 && lat <= 12.925 && lng >= 77.550 && lng <= 77.565) {
      return 'JP Nagar';
    }
    if (lat >= 12.955 && lat <= 12.970 && lng >= 77.585 && lng <= 77.600) {
      return 'Ashok Nagar';
    }
    if (lat >= 12.965 && lat <= 12.980 && lng >= 77.565 && lng <= 77.580) {
      return 'Seshadripuram';
    }
    if (lat >= 12.905 && lat <= 12.920 && lng >= 77.590 && lng <= 77.605) {
      return 'Madiwala';
    }
    if (lat >= 12.930 && lat <= 12.945 && lng >= 77.605 && lng <= 77.620) {
      return 'Bommanahalli';
    }
    if (lat >= 12.975 && lat <= 12.990 && lng >= 77.595 && lng <= 77.610) {
      return 'Cunningham Road';
    }
    if (lat >= 12.940 && lat <= 12.955 && lng >= 77.575 && lng <= 77.590) {
      return 'Lalbagh';
    }
    if (lat >= 12.915 && lat <= 12.930 && lng >= 77.565 && lng <= 77.580) {
      return 'Kumaraswamy Layout';
    }
    if (lat >= 12.970 && lat <= 12.985 && lng >= 77.600 && lng <= 77.615) {
      return 'Domlur';
    }
    if (lat >= 12.925 && lat <= 12.940 && lng >= 77.595 && lng <= 77.610) {
      return 'HSR Sector 1';
    }
    if (lat >= 12.980 && lat <= 12.995 && lng >= 77.565 && lng <= 77.580) {
      return 'Malleswaram';
    }
    return 'Bengaluru';
  }
  return location;
};

const getGoogleMapsUrl = (location) => {
  if (!location) return '#';
  const latLngMatch = location.match(/Lat:\s*([\d.-]+),\s*Lng:\s*([\d.-]+)/);
  if (latLngMatch) {
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[2]);
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
};

function AdminSidebar({ updateAuth }) {
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser');

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUser');
    if (updateAuth) {
      updateAuth();
    }
    navigate('/admin/login');
  };

  return (
    <div className="h-screen w-64 bg-slate-900 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">CivicPulse BBMP</h1>
            <p className="text-slate-400 text-xs">Operations Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
              <User className="text-white w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {adminUser ? `Officer ${adminUser}` : 'BBMP Officer'}
              </p>
              <p className="text-blue-400 text-sm font-semibold">
                🛡️ Active
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ updateAuth }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('adminId')) {
      navigate('/admin/login');
    }
    loadReports();
  }, [navigate]);

  const loadReports = async () => {
    try {
      const { getReports } = await import('../api/client');
      const allReports = await getReports();
      setReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
      const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      setReports(savedReports);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      const { updateReportStatus, getUser } = await import('../api/client');
      const { getUserData, setUserData } = await import('../utils/storage');
      const report = reports.find(r => r.id === reportId);
      
      await updateReportStatus(reportId, 'Resolved');
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        const stats = getUserData('stats', { reportsFiled: 0, activeTickets: 0, resolved: 0 });
        setUserData('stats', {
          ...stats,
          resolved: (stats.resolved || 0) + 1,
          activeTickets: Math.max(0, (stats.activeTickets || 0) - 1)
        });
        
        const userReports = getUserData('reports', []);
        
        const sortReports = (a, b) => {
          const aResolved = a.status === 'Resolved' || a.status === 'Fixed';
          const bResolved = b.status === 'Resolved' || b.status === 'Fixed';
          if (aResolved && !bResolved) return 1;
          if (!aResolved && bResolved) return -1;
          return 0;
        };
        
        const updatedReports = userReports.map(r => 
          r.id === reportId ? { ...r, status: 'Resolved' } : r
        ).sort(sortReports);
        
        setUserData('reports', updatedReports);
      }
      
      if (report && report.reportedBy && report.reportedBy !== 'anonymous') {
        try {
          await getUser(report.reportedBy);
        } catch (e) {
          console.error('Failed to refresh user data:', e);
        }
      }
      
      if (window.refreshHomeDashboard) {
        window.refreshHomeDashboard();
      }
      if (window.refreshMilestones) {
        window.refreshMilestones();
      }
      if (window.refreshSidebar) {
        window.refreshSidebar();
      }
      if (window.forceRefreshSidebar) {
        window.forceRefreshSidebar();
      }
      
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
    loadReports();
    alert('Problem resolved successfully!');
  };

  const categories = ['all', 'potholes', 'garbage', 'wire'];

  const sortAdminReports = (a, b) => {
    const aResolved = a.status === 'Resolved' || a.status === 'Fixed';
    const bResolved = b.status === 'Resolved' || b.status === 'Fixed';
    if (aResolved && !bResolved) return 1;
    if (!aResolved && bResolved) return -1;
    return (b.weightScore || 0) - (a.weightScore || 0);
  };
  
  const filteredReports = reports.filter(report => {
    if (tab === 'all') return true;
    if (tab === 'potholes') return report.category === 'Pothole';
    if (tab === 'garbage') return report.category === 'Garbage';
    if (tab === 'wire') return report.category === 'Broken Wire';
    return true;
  }).sort(sortAdminReports);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar updateAuth={updateAuth} />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Operations Dashboard</h1>
                <p className="text-slate-600">Monitor and manage infrastructure issues across the city</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={loadReports}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Refresh
                </button>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>SPATIAL DISPATCH ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">Total Reports</p>
                <p className="text-4xl font-bold text-slate-900">{reports.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">High Priority</p>
                <p className="text-4xl font-bold text-red-600">
                  {reports.filter(r => (r.priority || 'Medium') === 'High' || (r.priority || 'Medium') === 'Critical').length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">In Progress</p>
                <p className="text-4xl font-bold text-amber-600">
                  {reports.filter(r => (r.status || 'New') === 'In Progress' || (r.status || 'New') === 'New').length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">Resolved Today</p>
                <p className="text-4xl font-bold text-emerald-600">
                  {reports.filter(r => (r.status || 'New') === 'Resolved').length}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {categories.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    tab === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'All Reports' : 
                   t === 'potholes' ? 'Potholes' : 
                   t === 'garbage' ? 'Garbage Dumps' : 'Street Lights / Wires'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Incident Analysis Core</h2>
            <p className="text-slate-600 mb-6">
              Tickets sorted by proximity cluster weight — highest impact first. Multiple reports from the same location are merged and prioritized.
            </p>

            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-500 text-lg">No reports yet</p>
                  <p className="text-slate-400 text-sm mt-2">Reports submitted by citizens will appear here</p>
                </div>
              ) : (
                filteredReports.map((r, i) => (
                  <div
                    key={r.id || i}
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                      i === 0 ? 'border-red-300 shadow-lg' : 'border-slate-200'
                    }`}
                  >
                    {i === 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-600 font-bold">CRITICAL QUEUE HEAD</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4 flex-1">
                        {r.image && r.image.startsWith('data:') && (
                          <img 
                            src={r.image} 
                            alt={r.category || 'Report'} 
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{getAreaName(r.address)}</h3>
                          <a 
                            href={getGoogleMapsUrl(r.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 flex items-center gap-1 mt-1 hover:text-blue-600"
                          >
                            <MapPin className="w-4 h-4" /> {r.address || 'Location not available'}
                          </a>
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-center">
                        <div className="text-xs font-semibold uppercase">Weight</div>
                        <div className="text-2xl font-bold">{r.weightScore || 10}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (r.severity || 'Medium') === 'High'
                          ? 'bg-red-100 text-red-700'
                          : (r.severity || 'Medium') === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {r.category || 'Issue'}
                      </span>
                      <span className="text-slate-600">Severity: {r.severity || 'Medium'}</span>
                      <span className="text-slate-600">AI Confidence: {Math.round((r.aiConfidence || 0.8) * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-semibold">📍 {r.votes || 1} clustered submissions</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        (r.priority || 'Medium') === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : (r.priority || 'Medium') === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : (r.priority || 'Medium') === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {r.priority || 'Medium'} Priority
                      </span>
                    </div>

                    {r.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolve(r.id)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                      >
                        Resolve Problem
                      </button>
                    )}
                    {r.status === 'Resolved' && (
                      <div className="w-full bg-slate-100 text-emerald-700 py-3 rounded-xl font-semibold text-center">
                        ✅ Problem Resolved
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
