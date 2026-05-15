import { Home, MapPin, Camera, Trophy, LogOut, Building2, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/map', icon: MapPin, label: 'Live Map' },
  { to: '/detect', icon: Camera, label: 'AI Detector' },
  { to: '/milestones', icon: Trophy, label: 'Milestones' },
];

export default function Sidebar({ updateAuth }) {
  const navigate = useNavigate();
  const mobile = localStorage.getItem('mobile');
  const points = 320;

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('mobile');
    if (updateAuth) {
      updateAuth();
    }
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-slate-900 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">CivicPulse</h1>
            <p className="text-slate-400 text-xs">Smart City Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="text-slate-400 w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {mobile ? `User ${mobile}` : 'Citizen'}
              </p>
              <p className="text-emerald-400 text-sm font-semibold">
                🏆 {points} Points
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
