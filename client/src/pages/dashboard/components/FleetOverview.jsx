import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { ChartContainer } from '@/components/ui/ChartContainer';

/**
 * Recharts Custom Glass Tooltip styling
 */
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-2.5 rounded-xl shadow-premium text-left select-none text-[11px] font-semibold text-slate-700">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-slate-800 font-bold">{data.name}</span>
        </div>
        <div className="flex justify-between gap-6 text-[10px]">
          <span className="text-slate-450">Active count:</span>
          <span className="font-bold text-slate-850">{data.value} units</span>
        </div>
      </div>
    );
  }
  return null;
}

export function FleetOverview({ data, isLoading, onRefresh }) {
  const handleExport = () => {
    alert('Exporting fleet distribution logs...');
  };

  return (
    <ChartContainer
      title="Vehicle Classification"
      subtitle="Categorized inventory size across active fleet operations."
      isLoading={isLoading}
      onRefresh={onRefresh}
      onExport={handleExport}
    >
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}
            formatter={(value) => {
              const item = data?.find((d) => d.name === value);
              return `${value} (${item ? item.value : 0})`;
            }}
          />
          <Pie
            data={data || []}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={3}
          >
            {(data || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default FleetOverview;
