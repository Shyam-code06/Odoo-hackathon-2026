import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg text-center">
        {/* Animated illustration */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="relative mb-8"
        >
          {/* Large 404 number */}
          <div className="relative select-none">
            <span className="text-[120px] font-extrabold text-slate-100 leading-none tracking-tighter">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center shadow-premium-md">
                <Map className="w-12 h-12 text-slate-300" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-3 mb-8"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page Not Found</p>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Lost in the fleet yard?</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location in the platform registry.
          </p>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-premium text-left"
        >
          <div className="flex items-center gap-3 text-slate-500">
            <Search className="w-4 h-4 shrink-0" />
            <p className="text-xs font-semibold">
              Try using <span className="font-bold text-slate-700">⌘K</span> global search to find what you need.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-primary/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
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
          TransitOps Platform · Error 404
        </p>
      </div>
    </div>
  );
}

export default NotFound;
