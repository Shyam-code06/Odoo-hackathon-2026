import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { expenseService } from '@/services/expenseService';
import toast from 'react-hot-toast';

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
          <span className="text-slate-455 text-slate-400">Cost incurred:</span>
          <span className="font-bold text-slate-800">${data.value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}

export function ExpenseOverview({ data, isLoading, onRefresh }) {
  const handleExport = async () => {
    try {
      const filename = await expenseService.export('csv');
      toast.success(`Operational expense report downloaded: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export operational expense report.');
    }
  };

  // Sum total operational cost
  const totalCost = data?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <ChartContainer
      title="Expense Distribution"
      subtitle="Operational budget splits across fuel, tolls, and maintenance services."
      isLoading={isLoading}
      onRefresh={onRefresh}
      onExport={handleExport}
    >
      <div className="relative w-full h-[230px]">
        {/* Center Total Count Label inside the donut */}
        {!isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none -translate-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              TOTAL SPENT
            </span>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5">
              ${totalCost.toLocaleString()}
            </span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
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
                return `${value} ($${item ? item.value.toLocaleString() : 0})`;
              }}
            />
            <Pie
              data={data || []}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={75}
              paddingAngle={4}
            >
              {(data || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}

export default ExpenseOverview;
