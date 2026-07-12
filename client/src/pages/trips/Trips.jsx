import { useState, useEffect, useCallback } from 'react';
import { Route, Plus, Search, RefreshCw, X, AlertTriangle, Compass, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Drawer } from '@/components/ui/Drawer';
import { ConfirmationDialog } from '@/components/ui/Modal';
import { tripService } from '@/services/tripService';
import { usePermission } from '@/hooks/usePermission';

// Subcomponents
import { TripWizard } from './components/TripWizard';
import { ActiveTrips } from './components/ActiveTrips';
import { CompletedTrips } from './components/CompletedTrips';
import { TripDrawer } from './components/TripDrawer';

export function Trips() {
  const { hasPermission } = usePermission();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Drawer / Modal states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [detailTrip, setDetailTrip] = useState(null);
  const [cancelTripItem, setCancelTripItem] = useState(null);
  const [completeTripItem, setCompleteTripItem] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // 1. Debounce Search queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch list items from service
  const fetchTrips = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips data:', err);
      toast.error('Could not retrieve active dispatches.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrips();
  }, [fetchTrips]);

  // 3. Dispatch Handlers
  const handleCreateTrip = async (newTripData) => {
    try {
      await tripService.create(newTripData);
      fetchTrips();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTripItem) return;
    setIsModalLoading(true);
    try {
      const updated = { ...cancelTripItem, status: 'cancelled' };
      // Insert cancellation timeline checkpoint
      updated.timeline = [
        ...(updated.timeline || []),
        {
          id: `evt-${Date.now()}`,
          type: 'maintenance_alert',
          title: 'Trip Cancelled',
          description: 'Shipment cancellation authorized by terminal operations command.',
          timestamp: 'Just now'
        }
      ];
      await tripService.update(cancelTripItem.id, updated);
      toast.success('Trip dispatch cancelled.');
      setCancelTripItem(null);
      setDetailTrip(null);
      fetchTrips();
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel trip.');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCompleteConfirm = async () => {
    if (!completeTripItem) return;
    setIsModalLoading(true);
    try {
      const updated = { ...completeTripItem, status: 'completed' };
      // Insert completed timeline checkpoint
      updated.timeline = [
        ...(updated.timeline || []),
        {
          id: `evt-${Date.now()}`,
          type: 'completed',
          title: 'Trip Completed',
          description: 'Shipment arrived at destination terminal. Cargo checks clean.',
          timestamp: 'Just now'
        }
      ];
      await tripService.update(completeTripItem.id, updated);
      toast.success('Trip successfully completed!');
      setCompleteTripItem(null);
      setDetailTrip(null);
      fetchTrips();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update trip status.');
    } finally {
      setIsModalLoading(false);
    }
  };

  // 4. Filters, Search matching
  const filteredTrips = trips.filter((trip) => {
    // A. Match search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      const match = 
        trip.tripName?.toLowerCase().includes(query) ||
        trip.tripCode?.toLowerCase().includes(query) ||
        trip.driverName?.toLowerCase().includes(query) ||
        trip.vehicleName?.toLowerCase().includes(query) ||
        trip.plateNumber?.toLowerCase().includes(query);
      
      if (!match) return false;
    }

    // B. Match Filter selects
    if (filterStatus !== 'all' && trip.status !== filterStatus) return false;
    if (filterPriority !== 'all' && trip.priority !== filterPriority) return false;

    return true;
  });

  // Segregations
  const activeTrips = filteredTrips.filter((t) => t.status === 'in_transit' || t.status === 'dispatched' || t.status === 'delayed');
  const completedTrips = filteredTrips.filter((t) => t.status === 'completed' || t.status === 'cancelled');

  // Stats Counters
  const totalCount = trips.length;
  const activeCount = trips.filter((t) => t.status === 'in_transit' || t.status === 'dispatched' || t.status === 'delayed').length;
  const completedCount = trips.filter((t) => t.status === 'completed').length;
  const delayedCount = trips.filter((t) => t.status === 'delayed').length;

  return (
    <PageWrapper>
      <div className="space-y-6 select-none">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-subtle pb-6 text-left">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Active Trips & Dispatch Center</h1>
            <p className="text-sm text-slate-500 mt-1">Plan, dispatch, and track active route shipments across your operations network.</p>
          </div>
          {hasPermission('create_trip') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
              leftIcon={Plus}
            >
              New Trip Dispatch
            </Button>
          )}
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <StatCard title="Total Dispatched Loads" value={totalCount} icon={Route} colorVariant="blue" />
          <StatCard title="Active In Transit" value={activeCount} icon={Compass} colorVariant="blue" trend={2.4} trendDirection="up" />
          <StatCard title="Completed Deliveries" value={completedCount} icon={CheckCircle2} colorVariant="emerald" trend={8.2} trendDirection="up" />
          <StatCard title="Delayed Shipments" value={delayedCount} icon={AlertTriangle} colorVariant={delayedCount > 0 ? "rose" : "blue"} />
        </div>

        {/* 2. Quick Actions Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hasPermission('create_trip') && (
            <div
              onClick={() => setIsWizardOpen(true)}
              className="p-4.5 border border-slate-200/80 rounded-2xl bg-white shadow-premium-sm hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4 text-left"
            >
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Dispatch Wizard</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Multi-step consignment planner.</p>
              </div>
            </div>
          )}

          {hasPermission('export_data') && (
            <div
              onClick={() => alert('Generating active route mapping logs...')}
              className="p-4.5 border border-slate-200/80 rounded-2xl bg-white shadow-premium-sm hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4 text-left"
            >
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Dispatch Report</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Download active route logs.</p>
              </div>
            </div>
          )}

          <div
            onClick={() => fetchTrips(true)}
            className="p-4.5 border border-slate-200/80 rounded-2xl bg-white shadow-premium-sm hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.06)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4 text-left"
          >
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Sync Telemetry</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Force reload dispatch grids.</p>
            </div>
          </div>
        </div>

        {/* 3. Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-premium-sm">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search trip reference, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-8.5 py-2.5 bg-brand-bg border border-slate-200/80 rounded-xl focus:border-brand-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400 font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Status */}
            <div className="w-40">
              <Select
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'dispatched', label: 'Dispatched' },
                  { value: 'in_transit', label: 'In Transit' },
                  { value: 'delayed', label: 'Delayed' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
              />
            </div>

            {/* Filter Priority */}
            <div className="w-40">
              <Select
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'Normal', label: 'Normal' },
                  { value: 'High', label: 'High Priority' },
                ]}
                value={filterPriority}
                onChange={setFilterPriority}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTrips(true)}
              isLoading={isRefreshing}
              leftIcon={RefreshCw}
            >
              Sync
            </Button>
          </div>
        </div>

        {/* 4. Active In-Transit Grids Section */}
        <div className="space-y-4 text-left">
          <SectionHeader
            title="In-Transit Active Dispatches"
            description="Operational tracking coordinates for active route loads and shipments."
          />
          <ActiveTrips
            trips={activeTrips}
            onView={(t) => setDetailTrip(t)}
            onComplete={(t) => setCompleteTripItem(t)}
            onCancel={(t) => setCancelTripItem(t)}
          />
        </div>

        {/* 5. Completed Log Feeds */}
        <div className="space-y-4 text-left">
          <SectionHeader
            title="Recent Completed Deliveries"
            description="Archive records for completed and cancelled shipping dispatches."
          />
          <CompletedTrips
            trips={completedTrips}
            isLoading={isLoading}
            onView={(t) => setDetailTrip(t)}
          />
        </div>

        {/* 6. Stepper Dispatch Wizard */}
        <TripWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSave={handleCreateTrip}
        />

        {/* 7. Details Right Drawer */}
        <Drawer
          isOpen={!!detailTrip}
          onClose={() => setDetailTrip(null)}
          title="Trip Telemetry Manifest"
          size="md"
        >
          {detailTrip && (
            <TripDrawer
              item={detailTrip}
              onComplete={(t) => setCompleteTripItem(t)}
              onCancel={(t) => setCancelTripItem(t)}
            />
          )}
        </Drawer>

        {/* 8. Deletion/Cancellation confirmation dialog */}
        <ConfirmationDialog
          isOpen={!!cancelTripItem}
          onClose={() => setCancelTripItem(null)}
          onConfirm={handleCancelConfirm}
          title="Confirm Dispatch Cancellation"
          message={`Are you sure you want to cancel dispatch ${cancelTripItem?.tripCode}? This will release the assigned truck and driver back to the available registry.`}
          variant="danger"
          confirmLabel="Cancel Dispatch"
          isLoading={isModalLoading}
        />

        {/* 9. Completion confirmation dialog */}
        <ConfirmationDialog
          isOpen={!!completeTripItem}
          onClose={() => setCompleteTripItem(null)}
          onConfirm={handleCompleteConfirm}
          title="Confirm Delivery Arrival"
          message={`Confirming arrival of shipment ${completeTripItem?.tripCode} at destination ${completeTripItem?.destination}. This verifies cargo delivery logs.`}
          variant="success"
          confirmLabel="Complete Delivery"
          isLoading={isModalLoading}
        />
      </div>
    </PageWrapper>
  );
}

export default Trips;
