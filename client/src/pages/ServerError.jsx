import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Server, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export function ServerError() {
  const handleReload = () => window.location.reload();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg text-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-rose-50 border-2 border-rose-100 rounded-3xl flex items-center justify-center">
            <Server className="w-16 h-16 text-brand-danger" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-danger rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-xs">!</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-3 mb-8"
        >
          <p className="text-sm font-bold text-brand-danger uppercase tracking-widest">Error 500</p>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Internal Server Error</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            Our servers are experiencing a temporary issue. The engineering team has been automatically notified and is working on a fix.
          </p>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 text-left shadow-premium"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">System Status</p>
          {[
            { label: 'API Gateway', status: 'Degraded', color: 'bg-brand-danger' },
            { label: 'Database Layer', status: 'Operational', color: 'bg-brand-success' },
            { label: 'Fleet Tracking', status: 'Operational', color: 'bg-brand-success' },
            { label: 'Auth Service', status: 'Operational', color: 'bg-brand-success' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-subtle last:border-0">
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[10px] font-bold text-slate-500">{item.status}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-primary/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Request
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </motion.div>

        <p className="text-[10px] text-slate-400 mt-6 font-semibold">
          Reference: ERR-500-{Date.now().toString(36).toUpperCase()} · TransitOps Platform
        </p>
      </div>
    </div>
  );
}

export default ServerError;
