import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Eye, EyeOff, Shield, BarChart3, Route, 
  Zap, ArrowRight, Mail, Lock, User, Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Truck, label: 'Fleet Tracking', desc: 'Real-time vehicle management' },
  { icon: Route, label: 'Trip Dispatch', desc: 'Smart route optimization' },
  { icon: BarChart3, label: 'Analytics', desc: 'Advanced performance insights' },
  { icon: Shield, label: 'Safety', desc: 'Compliance monitoring' },
];

const ROLES = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager', desc: 'Manage vehicles and overview reports' },
  { value: 'DISPATCHER', label: 'Dispatcher', desc: 'Control dispatches and operator routes' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer', desc: 'Audit compliance and maintenance' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst', desc: 'Track costs and ROI' }
];

export function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FLEET_MANAGER');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, role);
    if (res.success) {
      toast.success('Registration successful! Welcome to TransitOps.', { icon: '👋' });
      navigate('/');
    } else {
      toast.error(res.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex font-sans overflow-hidden">
      {/* Left Panel — Product Showcase */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden">
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
              TransitOps Workspace Setup
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Get started with
              <br />
              Enterprise Fleet Operations
            </h1>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Create an account and setup your fleet profile to gain access to automated dispatch controls, telemetry statistics, and real-time maintenance logs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 max-w-lg">
            {FEATURES.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/30 hover:bg-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-3 group-hover:bg-brand-primary/20 transition-colors">
                  <feat.icon className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-xs font-bold text-white">{feat.label}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 relative z-10">
          Trusted by logistics operators worldwide.
        </p>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="w-full lg:w-[480px] bg-white p-8 sm:p-12 flex flex-col justify-center relative overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create your Account</h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Select your administrative role to initialize permissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@transitops.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-brand-primary focus:outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Platform Role Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-brand-primary focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal mt-1">
              {ROLES.find(r => r.value === role)?.desc}
            </p>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-primary hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/25 disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-4"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Creating Account...
              </>
            ) : (
              <>
                Create Account & Join
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-brand-primary hover:text-blue-700 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} TransitOps · Enterprise Fleet Platform
        </p>
      </div>
    </div>
  );
}

export default Register;
