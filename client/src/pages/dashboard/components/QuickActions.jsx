import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  DollarSign 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Vehicle",
      description: "Register a new vehicle asset",
      icon: Truck,
      path: "/fleet/vehicles",
      color: "text-blue-500 bg-blue-50 border-blue-100",
    },
    {
      title: "Add Driver",
      description: "Onboard CDL operator",
      icon: Users,
      path: "/fleet/drivers",
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Create Trip",
      description: "Schedule route & dispatch load",
      icon: Route,
      path: "/fleet/trips",
      color: "text-purple-500 bg-purple-50 border-purple-100",
    },
    {
      title: "Log Maintenance",
      description: "Schedule repair audit log",
      icon: Wrench,
      path: "/maintenance",
      color: "text-rose-500 bg-rose-50 border-rose-100",
    },
    {
      title: "Fuel Entry",
      description: "Log diesel purchase receipt",
      icon: Fuel,
      path: "/fuel-expenses/fuel",
      color: "text-amber-500 bg-amber-50 border-amber-100",
    },
    {
      title: "Record Expense",
      description: "Log tolls or equipment invoice",
      icon: DollarSign,
      path: "/fuel-expenses/expenses",
      color: "text-slate-655 bg-slate-50 border-slate-100",
    },
  ];

  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Command Shortcuts</h3>
        <PlusCircle className="w-4 h-4 text-slate-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center justify-center p-4 border border-slate-200/70 hover:border-slate-350 hover:bg-slate-50/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-center cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 shrink-0 ${act.color}`}>
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-tight">
                {act.title}
              </span>
              <span className="text-[9px] font-medium text-slate-400 mt-1 max-w-[110px] leading-tight">
                {act.description}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default QuickActions;
