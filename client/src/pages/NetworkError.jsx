import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home, Signal } from 'lucide-react';

export function NetworkError() {
  const handleReload = () => window.location.reload();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center">
        {/* Animated illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-slate-100 border-2 border-slate-200 rounded-3xl flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-slate-400" />
          </div>
          {/* Animated signal rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-2 border-slate-300 rounded-3xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 mb-8"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Connection</p>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Unable to Reach Server</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            TransitOps can't connect to the operations network. Check your internet connection and try again.
          </p>
        </motion.div>

        {/* Checklist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 text-left shadow-premium"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            Troubleshooting Steps
          </p>
          {[
            'Check your Wi-Fi or ethernet connection',
            'Verify VPN or firewall isn\'t blocking the app',
            'Try refreshing your DNS settings',
            'Contact your network administrator if this persists',
          ].map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 py-1.5 border-b border-subtle last:border-0">
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400">{idx + 1}</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 leading-relaxed">{step}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-primary/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default NetworkError;
