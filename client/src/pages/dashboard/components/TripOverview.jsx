import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { tripService } from '@/services/tripService';
import toast from 'react-hot-toast';

/**
 * Recharts Custom Glass Tooltip styling
 */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl shadow-premium text-left select-none text-[11px] font-semibold text-slate-700">
        <p className="font-bold text-slate-800 border-b border-subtle pb-1 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((pld) => (
            <div key={pld.name} className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }} />
                <span className="text-slate-455 text-slate-400">{pld.name}:</span>
              </div>
              <span className="font-bold text-slate-800">{pld.value} trips</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function TripOverview({ data, isLoading, onRefresh }) {
  const handleExport = async () => {
    try {
      const filename = await tripService.export('csv');
      toast.success(`Trip metrics report downloaded: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export trip activity report.');
    }
  };

  return (
    <ChartContainer
      title="Trip Activity Analytics"
      subtitle="Monthly dispatch cycles, completion rates, and cancellations."
      isLoading={isLoading}
      onRefresh={onRefresh}
      onExport={handleExport}
    >
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart 
          data={data || []} 
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--color-slate-200)" 
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-slate-500)', fontSize: 10, fontWeight: 600 }} 
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-slate-500)', fontSize: 10, fontWeight: 600 }} 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle" 
            iconSize={6}
            wrapperStyle={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}
          />

          <Area
            name="Completed"
            type="monotone"
            dataKey="completed"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompleted)"
          />
          <Area
            name="Active"
            type="monotone"
            dataKey="active"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActive)"
          />
          <Area
            name="Pending"
            type="monotone"
            dataKey="pending"
            stroke="#F59E0B"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPending)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default TripOverview;
