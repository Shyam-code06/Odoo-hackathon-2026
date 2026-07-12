import { 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { fuelService } from '@/services/fuelService';
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
          <div className="flex items-center gap-6 justify-between">
            <span className="text-slate-455 text-slate-405 text-slate-400">Fuel Cost:</span>
            <span className="font-bold text-slate-800">${payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-6 justify-between">
            <span className="text-slate-455 text-slate-405 text-slate-400">Consumption:</span>
            <span className="font-bold text-slate-800">{payload[1].value.toLocaleString()} gal</span>
          </div>
          {payload[2] && (
            <div className="flex items-center gap-6 justify-between">
              <span className="text-slate-455 text-slate-405 text-slate-400">Efficiency:</span>
              <span className="font-bold text-slate-800">{payload[2].value} MPG</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function FuelAnalytics({ data, isLoading, onRefresh }) {
  const handleExport = async () => {
    try {
      const filename = await fuelService.export('csv');
      toast.success(`Fuel logs report downloaded: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export fuel logs.');
    }
  };

  return (
    <ChartContainer
      title="Fuel Consumption & Cost Trends"
      subtitle="Correlating monthly fuel expense spikes with average engine efficiency."
      isLoading={isLoading}
      onRefresh={onRefresh}
      onExport={handleExport}
    >
      <ResponsiveContainer width="100%" height={230}>
        <BarChart 
          data={data || []} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
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
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-slate-500)', fontSize: 10, fontWeight: 600 }} 
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
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

          <Bar 
            yAxisId="left"
            name="Fuel Cost ($)" 
            dataKey="cost" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={30}
          />
          
          <Bar 
            yAxisId="left"
            name="Consumption (gal)" 
            dataKey="consumption" 
            fill="#8B5CF6" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={30}
          />

          <Line
            yAxisId="right"
            name="Efficiency (MPG)"
            type="monotone"
            dataKey="efficiency"
            stroke="#F59E0B"
            strokeWidth={2.5}
            dot={{ r: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default FuelAnalytics;
