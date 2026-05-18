import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, Camera, Trophy, LogOut, Building2, User, Menu, Bell, Search } from 'lucide-react';
import { getUser } from '../api/client';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/map', icon: MapPin, label: 'Live Map' },
  { to: '/detect', icon: Camera, label: 'AI Detector' },
  { to: '/milestones', icon: Trophy, label: 'Milestones' },
];

function Sidebar({ updateAuth }) {
  const navigate = useNavigate();
  const [renderKey, setRenderKey] = useState(0);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const mobile = localStorage.getItem('mobile');
  const [points, setPoints] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [forceKey, setForceKey] = useState(0);

  useEffect(() => {
    localStorage.removeItem('userPoints');
    localStorage.removeItem('stats');
    localStorage.removeItem('reports');
    localStorage.removeItem('notifications');
  }, []);

  useEffect(() => {
    if (userId) {
      getUser(userId).then((u) => setPoints(u.points || 0)).catch(() => {});
    }
  }, [userId, refreshKey, forceKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderKey(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.refreshSidebar = () => setRefreshKey(prev => prev + 1);
    window.forceRefreshSidebar = () => setForceKey(prev => prev + 1);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('mobile');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPoints');
    localStorage.removeItem('stats');
    localStorage.removeItem('reports');
    localStorage.removeItem('notifications');
    if (updateAuth) {
      updateAuth();
    }
    navigate('/');
  };

  return (
    <div key={renderKey} className="h-screen w-64 bg-slate-900 flex flex-col shadow-2xl">
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
                {userName || (mobile ? `User ${mobile}` : 'Citizen')}
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

function TopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderKey(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  };
  
  const clearAll = () => {
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  return (
    <header key={renderKey} className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
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
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearAll}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                          notif.read ? 'bg-white' : 'bg-emerald-50'
                        }`}
                      >
                        <p className={`text-sm ${notif.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
