import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Truck, Users, Route, Wrench, Fuel, 
  DollarSign, BarChart3, ArrowUpRight, Command
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils';

// Mock search results — replace with real API calls when USE_MOCK_DATA = false
const MOCK_SEARCH_DATA = [
  { id: 'v-1', type: 'vehicle', label: 'Truck TX-3921', sub: 'Active · John Weber', path: '/fleet/vehicles' },
  { id: 'v-2', type: 'vehicle', label: 'Van VN-1122', sub: 'Maintenance · Workshop Bay 3', path: '/fleet/vehicles' },
  { id: 'd-1', type: 'driver', label: 'John Weber', sub: 'Available · 8 yrs experience', path: '/fleet/drivers' },
  { id: 'd-2', type: 'driver', label: 'Maria Lopez', sub: 'On Trip · TRP-9902', path: '/fleet/drivers' },
  { id: 't-1', type: 'trip', label: 'Trip TRP-9902', sub: 'In Transit · Chicago → Detroit', path: '/fleet/trips' },
  { id: 't-2', type: 'trip', label: 'Trip TRP-8801', sub: 'Completed · New York → Boston', path: '/fleet/trips' },
  { id: 'm-1', type: 'maintenance', label: 'Oil Service TX-3921', sub: 'Overdue · 240 miles past interval', path: '/maintenance' },
  { id: 'f-1', type: 'fuel', label: 'Fuel Log FL-0094', sub: '$890.00 · Flagged for audit', path: '/fuel-expenses/fuel' },
  { id: 'r-1', type: 'report', label: 'Fleet Utilization Report', sub: 'Analytics · Monthly', path: '/analytics/reports' },
];

const TYPE_CONFIG = {
  vehicle: { icon: Truck, color: 'text-brand-primary bg-blue-50 border-blue-100', label: 'Vehicle' },
  driver: { icon: Users, color: 'text-brand-success bg-green-50 border-green-100', label: 'Driver' },
  trip: { icon: Route, color: 'text-brand-purple bg-purple-50 border-purple-100', label: 'Trip' },
  maintenance: { icon: Wrench, color: 'text-brand-secondary bg-amber-50 border-amber-100', label: 'Maintenance' },
  fuel: { icon: Fuel, color: 'text-teal-600 bg-teal-50 border-teal-100', label: 'Fuel' },
  expense: { icon: DollarSign, color: 'text-brand-danger bg-rose-50 border-rose-100', label: 'Expense' },
  report: { icon: BarChart3, color: 'text-slate-600 bg-slate-50 border-slate-100', label: 'Report' },
};

const QUICK_ACTIONS = [
  { label: 'All Vehicles', path: '/fleet/vehicles', icon: Truck },
  { label: 'Active Trips', path: '/fleet/trips', icon: Route },
  { label: 'Analytics', path: '/analytics/reports', icon: BarChart3 },
  { label: 'Maintenance', path: '/maintenance', icon: Wrench },
];

/**
 * Global search component — Cmd+K modal overlay.
 * Architecture is backend-ready: replace MOCK_SEARCH_DATA with a real API call.
 */
export function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 200);

  // Filter results from mock data
  const results = debouncedQuery.trim().length >= 2
    ? MOCK_SEARCH_DATA.filter((item) =>
        item.label.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.sub.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIdx(0);
    } else {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleSelect = useCallback((path) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const items = results.length > 0 ? results : QUICK_ACTIONS;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % items.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
    }
    if (e.key === 'Enter') {
      const item = items[activeIdx];
      if (item) handleSelect(item.path);
    }
  }, [results, activeIdx, onClose, handleSelect]);

  useEffect(() => {
    setActiveIdx(0);
  }, [debouncedQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="fixed top-[12vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-subtle">
                <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search vehicles, drivers, trips, reports..."
                  className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  aria-label="Global search"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-haspopup="listbox"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-400 select-none">
                  Esc
                </kbd>
              </div>

              {/* Results or Quick Actions */}
              <div className="max-h-80 overflow-y-auto" role="listbox">
                {results.length > 0 ? (
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
                      {results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                    </p>
                    {results.map((item, idx) => {
                      const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.report;
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={item.id}
                          role="option"
                          aria-selected={idx === activeIdx}
                          onClick={() => handleSelect(item.path)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer',
                            idx === activeIdx ? 'bg-brand-primary/8 ring-1 ring-brand-primary/20' : 'hover:bg-slate-50'
                          )}
                        >
                          <div className={cn('p-1.5 rounded-lg border shrink-0', cfg.color)}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{item.label}</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate">{item.sub}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border border-slate-100 bg-slate-50 px-1.5 py-0.5 rounded">
                              {cfg.label}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2">
                    {debouncedQuery.length >= 2 && (
                      <div className="py-6 text-center">
                        <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-500">No results for "{debouncedQuery}"</p>
                        <p className="text-[10px] text-slate-400 mt-1">Try different keywords</p>
                      </div>
                    )}
                    {debouncedQuery.length < 2 && (
                      <>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">Quick Navigation</p>
                        {QUICK_ACTIONS.map((action, idx) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.path}
                              onClick={() => handleSelect(action.path)}
                              onMouseEnter={() => setActiveIdx(idx)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer',
                                idx === activeIdx ? 'bg-brand-primary/8 ring-1 ring-brand-primary/20' : 'hover:bg-slate-50'
                              )}
                            >
                              <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                                <Icon className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                              <span className="text-xs font-semibold text-slate-700">{action.label}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                            </button>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Hint */}
              <div className="px-4 py-2.5 border-t border-subtle bg-slate-50/60 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px]">↑↓</kbd>
                  Navigate
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px]">↵</kbd>
                  Select
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                  <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px]">Esc</kbd>
                  Close
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                  <Command className="w-3 h-3" />K to open
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GlobalSearch;
