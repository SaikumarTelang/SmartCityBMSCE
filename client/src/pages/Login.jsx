import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';

export default function Login({ updateAuth }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('Login form submitted');
    console.log('Mobile:', mobile);
    console.log('Password:', password);
    e.preventDefault();
    setLoading(true);
    
    const uid = `demo_user_${mobile || 'guest'}`;
    localStorage.setItem('userId', uid);
    localStorage.setItem('mobile', mobile || 'guest');
    
    console.log('Stored userId:', localStorage.getItem('userId'));
    console.log('Stored mobile:', localStorage.getItem('mobile'));
    
    if (updateAuth) {
      updateAuth();
    }
    
    setTimeout(() => {
      setLoading(false);
      console.log('Navigating to /dashboard');
      navigate('/dashboard');
    }, 500);
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
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 mb-6">Enter any credentials to continue</p>

            <div className="space-y-4">
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
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-slate-400">
              New user?{' '}
              <button onClick={() => {}} className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                Register here
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
