import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route as RouteIcon, Eye } from 'lucide-react';
import { tripService } from '@/services/tripService';
import { Table } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function RecentTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAll();
        // Limit to recent 5 trips for dashboard summary
        setTrips(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load trips in recent log widget:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const columns = [
    {
      key: 'tripNumber',
      header: 'Trip ID',
      sortable: false,
      render: (row) => (
        <span className="font-bold text-slate-800 tracking-tight">
          {row.tripNumber}
        </span>
      ),
    },
    {
      key: 'vehicleName',
      header: 'Vehicle',
      sortable: false,
      render: (row) => (
        <div className="flex flex-col text-left">
          <span className="text-slate-700 font-bold">{row.vehicleName}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{row.vehiclePlate}</span>
        </div>
      ),
    },
    {
      key: 'driverName',
      header: 'Driver',
      sortable: false,
    },
    {
      key: 'route',
      header: 'Route Path',
      sortable: false,
      render: (row) => (
        <span className="text-slate-550 truncate max-w-[150px] inline-block font-semibold">
          {row.origin} ➜ {row.destination}
        </span>
      ),
    },
    {
      key: 'distance',
      header: 'Distance',
      sortable: false,
      align: 'right',
      render: (row) => (
        <span className="font-bold text-slate-700">{row.distance} mi</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'center',
      render: () => (
        <Button
          variant="outline"
          size="sm"
          className="p-1 h-7 w-7 rounded-lg shrink-0"
          onClick={() => navigate('/fleet/trips')}
          title="Inspect trip telemetry"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6 lg:p-8 text-left border-slate-200/80 shadow-premium flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-5 mb-5">
        <div className="flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Active Dispatches</h3>
        </div>
        <button
          onClick={() => navigate('/fleet/trips')}
          className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View All Trips
        </button>
      </div>

      <div className="flex-1">
        <Table
          columns={columns}
          data={trips}
          isLoading={isLoading}
          className="[&_th]:text-xs [&_th]:lg:text-sm [&_td]:text-sm [&_th]:py-5 [&_td]:py-5"
          emptyTitle="No active dispatches"
          emptyDescription="All vehicles are currently idle at terminal depots."
        />
      </div>
    </Card>
  );
}

export default RecentTrips;
