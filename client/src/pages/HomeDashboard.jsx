import { TrendingUp, AlertTriangle, CheckCircle, MapPin, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomeDashboard({ updateAuth }) {
  const navigate = useNavigate();

  const stats = [
    { label: 'Reports Filed', value: '12', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Tickets', value: '3', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Resolved', value: '8', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const recentReports = [
    { id: 1, type: 'Pothole', location: 'MG Road', status: 'In Progress', priority: 'High' },
    { id: 2, type: 'Garbage', location: 'Indiranagar', status: 'Resolved', priority: 'Medium' },
    { id: 3, type: 'Streetlight', location: 'Koramangala', status: 'New', priority: 'Low' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
                <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900">{report.type}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {report.location}
                    </p>
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
