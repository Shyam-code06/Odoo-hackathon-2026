import { PageWrapper } from '@/components/layout/PageWrapper';
import { Truck, Users, Route, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const statWidgets = [
    { label: 'Active Fleet Vehicles', value: '0', change: '0% utilization', icon: Truck, color: 'text-brand-primary bg-blue-50' },
    { label: 'On-Duty Drivers', value: '0', change: '0 available', icon: Users, color: 'text-brand-purple bg-purple-50' },
    { label: 'Trips in Transit', value: '0', change: '0 scheduled today', icon: Route, color: 'text-brand-secondary bg-amber-50' },
    { label: 'Urgent Maintenance Issues', value: '0', change: '0 scheduled repairs', icon: AlertTriangle, color: 'text-brand-danger bg-rose-50' },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operations Control</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time overview of fleet logistics, driver statuses, and operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled 
              className="px-4 py-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 opacity-60 cursor-not-allowed cursor-pointer"
            >
              Export Report
            </button>
            <button 
              disabled 
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-xl opacity-60 cursor-not-allowed cursor-pointer"
            >
              New Dispatch
            </button>
          </div>
        </div>

        {/* Dashboard Grid Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statWidgets.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium interactive-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-850 tracking-tight">{stat.value}</span>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual empty board placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 min-h-[300px] flex flex-col justify-between shadow-premium">
            <div className="flex justify-between items-center border-b border-subtle pb-4">
              <h3 className="font-semibold text-slate-800 text-sm">Transport Routes Tracking</h3>
              <span className="text-xs text-slate-400">Map view placeholder</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-3">
                <Route className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-400 max-w-sm text-center leading-relaxed">
                Future prompts will render real-time interactive maps or dispatch lists here.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 min-h-[300px] flex flex-col justify-between shadow-premium">
            <div className="flex justify-between items-center border-b border-subtle pb-4">
              <h3 className="font-semibold text-slate-800 text-sm">Recent Activity Log</h3>
              <span className="text-xs text-slate-400">Live feeds</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-400 text-center px-4 leading-relaxed">
                Activity alerts (maintenance reports, fuel registry additions, check-ins) will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
