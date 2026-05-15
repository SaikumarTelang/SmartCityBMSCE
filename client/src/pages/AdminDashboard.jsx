import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, TrendingUp, LogOut, Building2, User } from 'lucide-react';
import { getAdminStats, dispatchReport } from '../api/client';

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
    loadSampleReports();
  }, [navigate]);

  const loadSampleReports = () => {
    const sampleReports = [
      {
        id: 1,
        ticketId: 'TKT-7824',
        category: 'Pothole',
        severity: 'High',
        aiConfidence: 0.92,
        votes: 12,
        weightScore: 96,
        address: 'MG Road, near Brigade Road',
        priority: 'Critical'
      },
      {
        id: 2,
        ticketId: 'TKT-5612',
        category: 'Garbage',
        severity: 'High',
        aiConfidence: 0.87,
        votes: 8,
        weightScore: 75,
        address: 'Indiranagar 100 Feet Road',
        priority: 'High'
      },
      {
        id: 3,
        ticketId: 'TKT-9432',
        category: 'Broken Wire',
        severity: 'Medium',
        aiConfidence: 0.81,
        votes: 5,
        weightScore: 48,
        address: 'Koramangala 5th Block',
        priority: 'Medium'
      },
      {
        id: 4,
        ticketId: 'TKT-2189',
        category: 'Garbage',
        severity: 'Low',
        aiConfidence: 0.75,
        votes: 2,
        weightScore: 22,
        address: 'HSR Layout Sector 3',
        priority: 'Low'
      }
    ];
    setReports(sampleReports);
  };

  const categories = ['all', 'potholes', 'garbage', 'wire'];

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
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>SPATIAL DISPATCH ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">Total Reports</p>
                <p className="text-4xl font-bold text-slate-900">27</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">High Priority</p>
                <p className="text-4xl font-bold text-red-600">8</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">In Progress</p>
                <p className="text-4xl font-bold text-amber-600">12</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium mb-2">Resolved Today</p>
                <p className="text-4xl font-bold text-emerald-600">7</p>
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
              {reports.map((r, i) => (
                <div
                  key={r.id}
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
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{r.ticketId}</h3>
                      <p className="text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" /> {r.address}
                      </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-center">
                      <div className="text-xs font-semibold uppercase">Weight</div>
                      <div className="text-2xl font-bold">{r.weightScore}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      r.severity === 'High'
                        ? 'bg-red-100 text-red-700'
                        : r.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {r.category}
                    </span>
                    <span className="text-slate-600">Severity: {r.severity}</span>
                    <span className="text-slate-600">AI Confidence: {Math.round(r.aiConfidence * 100)}%</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold">📍 {r.votes} clustered submissions</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      r.priority === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : r.priority === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : r.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {r.priority} Priority
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Engineers dispatched for ${r.ticketId}`)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
                  >
                    Dispatch Engineers
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
