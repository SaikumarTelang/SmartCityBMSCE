import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, Camera, Trophy, LogOut, Building2, User, Menu, Bell, Search } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/map', icon: MapPin, label: 'Live Map' },
  { to: '/detect', icon: Camera, label: 'AI Detector' },
  { to: '/milestones', icon: Trophy, label: 'Milestones' },
];

function Sidebar({ updateAuth }) {
  const navigate = useNavigate();
  const mobile = localStorage.getItem('mobile');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('mobile');
    if (updateAuth) {
      updateAuth();
    }
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
                🏆 320 Points
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

function TopNavbar() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children, updateAuth }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar updateAuth={updateAuth} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
