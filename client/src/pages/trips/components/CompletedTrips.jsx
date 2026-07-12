import { Eye, Clock, Fuel, Route } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';

export function CompletedTrips({ trips = [], isLoading, onView }) {
  const columns = [
    {
      key: 'tripCode',
      header: 'Trip ID',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-800 tracking-tight">{row.tripCode}</span>,
    },
    {
      key: 'tripName',
      header: 'Trip Name',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-700">{row.tripName}</span>,
    },
    {
      key: 'vehicleName',
      header: 'Assigned Vehicle',
      sortable: true,
    },
    {
      key: 'driverName',
      header: 'Assigned Driver',
      sortable: true,
    },
    {
      key: 'distance',
      header: 'Distance Covered',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-slate-700">{row.distance} mi</span>,
    },
    {
      key: 'fuelUsed',
      header: 'Diesel Used',
      align: 'right',
      render: (row) => {
        const fuel = Math.round(row.distance / 6.5);
        return (
          <span className="font-semibold text-slate-655 flex items-center gap-1 justify-end">
            <Fuel className="w-3.5 h-3.5 text-slate-400" />
            {fuel} gal
          </span>
        );
      },
    },
    {
      key: 'duration',
      header: 'Duration',
      align: 'right',
      render: (row) => {
        const hours = Math.round(row.distance / 52);
        return (
          <span className="font-semibold text-slate-655 flex items-center gap-1 justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {hours} hrs
          </span>
        );
      },
    },
    {
      key: 'expectedDeliveryDate',
      header: 'Completion Date',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <Dropdown>
          <DropdownTrigger>
            <button className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
              <Eye className="w-3.5 h-3.5" />
            </button>
          </DropdownTrigger>
          <DropdownMenu align="right" className="w-36">
            <DropdownItem icon={Eye} onClick={() => onView(row)}>
              Inspect details
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="relative">
      <Table
        columns={columns}
        data={trips}
        isLoading={isLoading}
        emptyTitle="No completed dispatches found"
        emptyDescription="All active in-transit trips appear in the dispatch control deck above."
        emptyIcon={Route}
      />
    </div>
  );
}

export default CompletedTrips;
