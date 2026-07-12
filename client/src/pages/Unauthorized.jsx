import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, Home, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLE_LABELS } from '@/constants';

export function Unauthorized() {
  const { user } = useAuth();
  const roleLabel = user ? (USER_ROLE_LABELS[user.role] || user.role) : 'your role';

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative mb-8"
        >
          <div className="w-28 h-28 mx-auto bg-amber-50 border-2 border-amber-100 rounded-3xl flex items-center justify-center">
            <ShieldOff className="w-14 h-14 text-brand-secondary" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-sm">!</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-3 mb-8"
        >
          <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Access Denied — 403</p>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Restricted Zone</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            You don't have permission to access this area. Your current role as <strong>{roleLabel}</strong> doesn't include this privilege.
          </p>
        </motion.div>

        {/* Permission info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-premium text-left"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">What to do</p>
          {[
            'Contact your Fleet Manager for elevated access',
            'Request role upgrade from your administrator',
            'Check if you\'re signed in with the correct account',
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 py-1.5 border-b border-subtle last:border-0">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-brand-secondary flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-extrabold">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-slate-600">{tip}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-primary/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        <p className="text-[10px] text-slate-400 mt-6 font-semibold">
          TransitOps Platform · Error 403 · {user?.email}
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
