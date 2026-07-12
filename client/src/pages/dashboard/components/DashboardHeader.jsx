import { useState } from 'react';
import { RefreshCw, Download, SlidersHorizontal, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export function DashboardHeader({ onRefresh, isRefreshing, onExport, isExporting }) {
  const [regionFilter, setRegionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North Region' },
    { value: 'south', label: 'South Region' },
    { value: 'east', label: 'East Region' },
    { value: 'west', label: 'West Region' },
  ];

  const vehicleTypes = [
    { value: 'all', label: 'All Fleet Types' },
    { value: 'trucks', label: 'Heavy Trucks' },
    { value: 'vans', label: 'Cargo Vans' },
    { value: 'trailers', label: 'Flatbed Trailers' },
  ];

  return (
    <div className="flex flex-col gap-5 border-b border-subtle pb-6 text-left select-none">
      {/* Top row: Title and primary buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">Operations Command</h1>
          <p className="text-sm text-slate-550 mt-2 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-450" />
            Active telemetry for {dayjs().format('MMMM DD, YYYY')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={RefreshCw}
          >
            Sync Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            isLoading={isExporting}
            onClick={onExport}
          >
            Export Logs
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={SlidersHorizontal}
          >
            Configure Panels
          </Button>
        </div>
      </div>

      {/* Bottom row: Interactive filter placeholders */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-xl p-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">
          Quick Filters:
        </span>
        <div className="w-40">
          <Select
            options={regions}
            value={regionFilter}
            onChange={setRegionFilter}
          />
        </div>
        <div className="w-44">
          <Select
            options={vehicleTypes}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-semibold italic pl-1 hidden sm:inline">
          * Telemetry groups will update in real time.
        </span>
      </div>
    </div>
  );
}

export default DashboardHeader;
