import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Eye, EyeOff, ChevronRight, Shield, 
  BarChart3, Route, Users, Zap, ArrowRight, Mail, Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const QUICK_LOGINS = [
  { role: 'Fleet Manager', email: 'admin@transitops.com', color: 'bg-blue-500', desc: 'Full platform access' },
  { role: 'Dispatcher', email: 'dispatcher@transitops.com', color: 'bg-emerald-500', desc: 'Trip & route control' },
  { role: 'Safety Officer', email: 'safety@transitops.com', color: 'bg-amber-500', desc: 'Compliance & audit' },
  { role: 'Financial Analyst', email: 'finance@transitops.com', color: 'bg-purple-500', desc: 'Finance & reporting' },
];

const FEATURES = [
  { icon: Truck, label: 'Fleet Tracking', desc: 'Real-time vehicle management' },
  { icon: Route, label: 'Trip Dispatch', desc: 'Smart route optimization' },
  { icon: BarChart3, label: 'Analytics', desc: 'Advanced performance insights' },
  { icon: Shield, label: 'Safety', desc: 'Compliance monitoring' },
];

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [email, setEmail] = useState('admin@transitops.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);

  // Already authenticated? redirect
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(email, password, rememberMe);
    if (res.success) {
      toast.success('Welcome back! Redirecting...', { icon: '🚀' });
      navigate('/');
    } else {
      toast.error(res.error || 'Authentication failed. Check your credentials.');
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('password');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setShowForgot(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex font-sans overflow-hidden">
      {/* Left Panel — Product Showcase */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden">
        {/* Decorative background orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-40px] w-80 h-80 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Transit<span className="text-brand-primary">Ops</span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest -mt-0.5">Enterprise Platform</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[11px] font-semibold text-brand-primary">
              <Zap className="w-3 h-3" />
              Version 2.0 — Now with AI Dispatch
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Operate your fleet
              <br />
              <span className="gradient-text">at enterprise scale</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The complete fleet management platform trusted by operations teams managing hundreds of vehicles across multiple regions.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="flex items-start gap-3 p-3.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/8 transition-colors"
                >
                  <div className="p-1.5 bg-brand-primary/15 rounded-lg shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{feat.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 pt-2 border-t border-white/8">
            {[
              { value: '500+', label: 'Active Vehicles' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '42', label: 'Drivers Online' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-600 relative z-10">
          © {new Date().getFullYear()} TransitOps Platform. Enterprise Fleet Operations.
        </p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="w-full lg:max-w-[460px] bg-white flex flex-col justify-center p-8 md:p-12 relative">
        {/* Mobile brand */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">Transit<span className="text-brand-primary">Ops</span></span>
        </div>

        <div className="space-y-1 mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome back</h2>
          <p className="text-sm text-slate-500">Sign in to your workspace</p>
        </div>

        {/* Quick Role Selector */}
        <div className="mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LOGINS.map((ql) => (
              <button
                key={ql.role}
                type="button"
                onClick={() => handleQuickLogin(ql.email)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer text-xs font-semibold hover:shadow-sm ${
                  email === ql.email
                    ? 'border-brand-primary bg-blue-50 text-brand-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${ql.color} shrink-0`} />
                <span className="truncate">{ql.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-brand-bg-secondary border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:outline-none transition-all"
                placeholder="your@company.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 bg-brand-bg-secondary border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs font-semibold text-brand-primary hover:text-blue-700 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-primary hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/25 disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Workspace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Demo hint */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            <span className="font-semibold text-slate-600">Demo credentials:</span> Select a role above — password is{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-brand-primary font-mono text-[10px]">password</code>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} TransitOps · Enterprise Fleet Platform
        </p>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!forgotSent) setShowForgot(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {!forgotSent ? (
                <>
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-5">
                    <Lock className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">Reset password</h3>
                  <p className="text-sm text-slate-500 mt-1.5 mb-6 leading-relaxed">
                    Enter your work email and we'll send you a secure reset link.
                  </p>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="your@company.com"
                        className="w-full px-4 py-3 bg-brand-bg-secondary border border-slate-200 rounded-xl text-sm focus:border-brand-primary focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowForgot(false)}
                        className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Send Link
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ChevronRight className="w-8 h-8 text-brand-success" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">Check your inbox</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    A reset link has been sent to <strong>{forgotEmail}</strong>. 
                    Closing in a moment...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
