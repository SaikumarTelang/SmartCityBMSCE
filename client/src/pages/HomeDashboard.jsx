import { TrendingUp, AlertTriangle, CheckCircle, MapPin, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserData, setUserData } from '../utils/storage';
import { getUser, getReports } from '../api/client';

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

export default function HomeDashboard({ updateAuth }) {
  const navigate = useNavigate();
  const [renderKey, setRenderKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [forceKey, setForceKey] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [serverReports, setServerReports] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderKey(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        getUser(userId).then((u) => setUserPoints(u.points || 0)).catch(() => {});
        try {
          const allReports = await getReports();
          const userReports = allReports.filter(r => r.reportedBy === userId);
          setServerReports(userReports);
          
          let reportsFiled = 0;
          let activeTickets = 0;
          let resolved = 0;
          userReports.forEach(r => {
            reportsFiled++;
            if (r.status === 'Resolved' || r.status === 'Fixed') {
              resolved++;
            } else {
              activeTickets++;
            }
          });
          
          setUserData('stats', { reportsFiled, activeTickets, resolved });
          
          const updatedLocalReports = userReports.map(r => ({
            id: r.id,
            ticketId: r.ticketId,
            category: r.category,
            severity: r.severity,
            aiConfidence: r.aiConfidence,
            votes: r.votes,
            weightScore: r.weightScore,
            address: r.address,
            priority: r.priority || r.severity,
            status: r.status,
            timestamp: r.timestamp?.toDate ? r.timestamp.toDate().toISOString() : r.timestamp,
            image: r.imagePreview
          }));
          
          const sortReportsForStorage = (a, b) => {
            const aResolved = a.status === 'Resolved' || a.status === 'Fixed';
            const bResolved = b.status === 'Resolved' || b.status === 'Fixed';
            if (aResolved && !bResolved) return 1;
            if (!aResolved && bResolved) return -1;
            return 0;
          };
          
          setUserData('reports', updatedLocalReports.sort(sortReportsForStorage));
        } catch (error) {
          console.error('Failed to load reports:', error);
        }
      }
    };
    
    loadData();
  }, [userId, forceKey]);
  
  useEffect(() => {
    window.refreshHomeDashboard = () => {
      setRenderKey(prev => prev + 1);
      setRefreshKey(prev => prev + 1);
      setForceKey(prev => prev + 1);
    };
  }, []);

  const statsData = getUserData('stats', { reportsFiled: 0, activeTickets: 0, resolved: 0 });
  
  const reportsFiled = statsData.reportsFiled || 0;
  const activeTickets = statsData.activeTickets || 0;
  const resolved = statsData.resolved || 0;

  const stats = [
    { label: 'Reports Filed', value: reportsFiled, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Tickets', value: activeTickets, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const savedReports = getUserData('reports', []);
  
  const sortReports = (a, b) => {
    const aResolved = a.status === 'Resolved' || a.status === 'Fixed';
    const bResolved = b.status === 'Resolved' || b.status === 'Fixed';
    if (aResolved && !bResolved) return 1;
    if (!aResolved && bResolved) return -1;
    return 0;
  };
  
  const recentReports = savedReports.length > 0 
    ? [...savedReports].sort(sortReports).slice(0, 3).map(r => ({
        id: r.id,
        type: r.category,
        location: r.address,
        status: r.status || 'New',
        priority: r.priority || 'Medium',
        image: r.image
      }))
    : [];

  return (
    <div key={renderKey} className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening in your city.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/detect')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all border border-emerald-200"
              >
                <Upload className="w-10 h-10 text-emerald-600 mb-3" />
                <span className="font-semibold text-emerald-800">Report Issue</span>
              </button>
              <button
                onClick={() => navigate('/map')}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
              >
                <MapPin className="w-10 h-10 text-blue-600 mb-3" />
                <span className="font-semibold text-blue-800">Live Map</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h2>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {report.image && report.image.startsWith('data:') && (
                    <img 
                      src={report.image} 
                      alt={report.type} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{report.type}</p>
                    <a 
                      href={getGoogleMapsUrl(report.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> {report.location}
                    </a>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === 'Resolved' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : report.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {report.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{report.priority} Priority</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
