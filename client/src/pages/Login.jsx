import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';
import { registerUser, loginUser } from '../api/client';
import { clearAllUserData } from '../utils/storage';

export default function Login({ updateAuth }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('mobile');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPoints');
      localStorage.removeItem('stats');
      localStorage.removeItem('reports');
      localStorage.removeItem('notifications');
      localStorage.removeItem('reportsFiled');
      localStorage.removeItem('resolved');
      
      if (isRegistering) {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }
        if (!name || !mobile || !password) {
          alert('Please fill in all fields!');
          setLoading(false);
          return;
        }
        
        const uid = `user_${Date.now()}`;
        const result = await registerUser({ uid, mobile, name, password });
        
        localStorage.setItem('userId', uid);
        localStorage.setItem('mobile', mobile);
        localStorage.setItem('userName', name);
        
        if (updateAuth) {
          updateAuth();
        }
        
        alert('Registration successful! Welcome to CivicPulse!');
      } else {
        if (!mobile || !password) {
          alert('Please fill in all fields!');
          setLoading(false);
          return;
        }
        
        const result = await loginUser({ mobile, password });
        
        localStorage.setItem('userId', result.uid);
        localStorage.setItem('mobile', mobile);
        localStorage.setItem('userName', result.profile.name);
        
        if (updateAuth) {
          updateAuth();
        }
      }
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl mb-4 shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CivicPulse</h1>
          <p className="text-slate-400">Smart City Infrastructure Tracker</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isRegistering ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 mb-6">
              {isRegistering ? 'Sign up to get started' : 'Enter your credentials to continue'}
            </p>

            <div className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              {isRegistering && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Please wait...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isRegistering ? 'Register' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-slate-400">
              {isRegistering ? 'Already have an account?' : 'New user?'}{' '}
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setName('');
                  setConfirmPassword('');
                }} 
                className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
              >
                {isRegistering ? 'Sign in here' : 'Register here'}
              </button>
            </p>
            <div className="border-t border-slate-700 pt-3">
              <button
                onClick={() => navigate('/admin/login')}
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                🛡️ BBMP Officer Login →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
