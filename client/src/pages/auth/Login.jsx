import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageWrapper } from '@/components/layout/PageWrapper';
import toast from 'react-hot-toast';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Pre-filled credentials for hackathon convenience
  const [email, setEmail] = useState('admin@transitops.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await login(email, password, rememberMe);
    if (res.success) {
      toast.success('Successfully authenticated');
      navigate('/');
    } else {
      toast.error(res.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-premium-lg border border-slate-200/80 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative Top Gradient Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-purple to-brand-secondary" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
            <Truck className="w-6 h-6 animate-pulse-slow" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome to TransitOps</h2>
          <p className="text-sm text-slate-500 mt-1.5">Enterprise Transport Operations Platform</p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-brand-bg-secondary border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:outline-none transition-all"
              placeholder="e.g., operator@transitops.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-brand-bg-secondary border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
              />
              Remember session
            </label>
            <a href="#forgot" className="text-brand-primary hover:underline transition-all">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Details */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TransitOps Platform. All rights reserved.</p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;
