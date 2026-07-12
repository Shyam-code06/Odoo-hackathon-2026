import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Radio } from '@/components/ui/Radio';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { StatusChip } from '@/components/ui/StatusChip';
import { Card, StatCard } from '@/components/ui/Card';
import { ConfirmationDialog } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Alert } from '@/components/ui/Alert';
import { Progress, CircularProgress } from '@/components/ui/Progress';
import { CardSkeleton, ListSkeleton } from '@/components/ui/Loader';
import { 
  Sliders, 
  Trash2, 
  FileText, 
  Search, 
  Truck, 
  Users, 
  AlertCircle,
  Eye
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('controls');

  // Input states
  const [inputText, setInputText] = useState('TransitOps admin panel');
  const [passwordText, setPasswordText] = useState('secret123');
  const [textareaText, setTextareaText] = useState('This is a resizable paragraph.');
  const [selectVal, setSelectVal] = useState('operator');

  // Selection states
  const [chkState, setChkState] = useState(true);
  const [radioState, setRadioState] = useState('one');
  const [switchState, setSwitchState] = useState(true);

  // Overlay states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectOptions = [
    { value: 'admin', label: 'System Administrator' },
    { value: 'operator', label: 'Fleet Coordinator' },
    { value: 'driver', label: 'Professional Driver' },
    { value: 'viewer', label: 'Guest Auditor' },
  ];

  const handleConfirmAction = () => {
    setDialogLoading(true);
    setTimeout(() => {
      setDialogLoading(false);
      setDialogOpen(false);
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="space-y-6 select-none">
        {/* Page Header */}
        <div className="text-left border-b border-subtle pb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Design System Library</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual Playground showcasing custom enterprise components.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-subtle pb-3">
          {[
            { id: 'controls', label: 'Controls & Inputs', icon: Sliders },
            { id: 'display', label: 'Display & Cards', icon: Truck },
            { id: 'overlays', label: 'Overlays & Skeletons', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-550 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Controls & Inputs */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Button Variants */}
            <Card className="space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Button Library</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="success">Save Changes</Button>
                <Button variant="danger" leftIcon={Trash2}>Delete</Button>
                <Button variant="warning">Alert Trigger</Button>
              </div>

              <div className="space-y-1.5 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State Demos</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" isLoading>Processing</Button>
                  <Button variant="secondary" isDisabled>Disabled Button</Button>
                  <Button variant="outline" size="sm">Small Outline</Button>
                  <Button variant="primary" size="lg">Large Scale</Button>
                </div>
              </div>
            </Card>

            {/* Input & Form Control */}
            <Card className="space-y-4 overflow-visible">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Inputs & Fields</h3>
              <Input
                label="Standard Search"
                placeholder="Search..."
                prefixIcon={Search}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onClear={() => setInputText('')}
              />
              <Input
                label="Password Field"
                type="password"
                value={passwordText}
                onChange={(e) => setPasswordText(e.target.value)}
              />
              <Select
                label="Assigned System Role"
                options={selectOptions}
                value={selectVal}
                onChange={setSelectVal}
                isSearchable
              />
            </Card>

            {/* Checkboxes & Switches */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Selection Toggles</h3>
              <div className="flex flex-col gap-3.5">
                <Checkbox
                  label="Receive weekly dispatch reports"
                  checked={chkState}
                  onChange={(e) => setChkState(e.target.checked)}
                />
                <Checkbox
                  label="Disabled operational audit"
                  checked={false}
                  isDisabled
                />
                <Switch
                  label="Automated trip SMS dispatches"
                  checked={switchState}
                  onChange={setSwitchState}
                />
                <Switch
                  label="Locked GPS location reporting"
                  checked={false}
                  isDisabled
                />
              </div>
            </Card>

            {/* Radio Toggles */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Radio Selection List</h3>
              <div className="flex flex-col gap-3.5">
                <Radio
                  label="Standard ground delivery route"
                  name="group-demo"
                  value="one"
                  checked={radioState === 'one'}
                  onChange={() => setRadioState('one')}
                />
                <Radio
                  label="Express trailer shipping route"
                  name="group-demo"
                  value="two"
                  checked={radioState === 'two'}
                  onChange={() => setRadioState('two')}
                />
                <Radio
                  label="Inactive logistics warehouse"
                  name="group-demo"
                  value="three"
                  isDisabled
                />
              </div>
            </Card>

            {/* Textarea Demo */}
            <Card className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Resizable Textarea</h3>
              <Textarea
                label="Special Dispatch Instructions"
                placeholder="Log internal comments..."
                value={textareaText}
                onChange={(e) => setTextareaText(e.target.value)}
                maxLength={200}
              />
            </Card>
          </div>
        )}

        {/* TAB 2: Display & Cards */}
        {activeTab === 'display' && (
          <div className="space-y-6 text-left">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue Generated"
                value="$145,290.00"
                icon={Truck}
                trendValue={14.8}
                trendDirection="up"
                colorVariant="primary"
              />
              <StatCard
                title="Active Fleet Drivers"
                value="42"
                icon={Users}
                trendValue={3.2}
                trendDirection="down"
                colorVariant="purple"
              />
              <StatCard
                title="Critical Incidents Reported"
                value="2"
                icon={AlertCircle}
                trendValue={0}
                trendDirection="neutral"
                colorVariant="danger"
              />
            </div>

            {/* Badges, StatusChips, Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="space-y-5">
                <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Labeling & Badges</h3>
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="primary">Primary Tag</Badge>
                  <Badge variant="success">Success Tag</Badge>
                  <Badge variant="warning">Warning Tag</Badge>
                  <Badge variant="danger">Danger Tag</Badge>
                  <Badge variant="info">Info Tag</Badge>
                  <Badge variant="neutral">Neutral Tag</Badge>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic StatusChips Mapping</p>
                  <div className="flex flex-wrap gap-2.5">
                    <StatusChip status="active" />
                    <StatusChip status="maintenance" />
                    <StatusChip status="available" />
                    <StatusChip status="on_trip" />
                    <StatusChip status="in_transit" />
                    <StatusChip status="delayed" />
                    <StatusChip status="overdue" />
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Notice Banners</h3>
                <Alert variant="info" title="System Notice">
                  New firmware update available for GPS modules.
                </Alert>
                <Alert variant="warning" title="Audit Required" isDismissible>
                  License verification check-in overdue for 2 operators.
                </Alert>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: Overlays & Skeletons */}
        {activeTab === 'overlays' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Dialogue & Drawer Triggers */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Modals & Overlays</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" leftIcon={Trash2} onClick={() => setDialogOpen(true)}>
                  Trigger Delete Dialog
                </Button>
                <Button variant="outline" leftIcon={FileText} onClick={() => setDrawerOpen(true)}>
                  Trigger Details Drawer
                </Button>
              </div>

              <div className="space-y-3 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress Loaders</p>
                <div className="flex items-center gap-6">
                  <Progress value={65} showValue className="flex-1" />
                  <CircularProgress size={36} strokeWidth={3} />
                </div>
              </div>
            </Card>

            {/* Skeletons Loader Demos */}
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-2">Skeleton Placeholders</h3>
              <div className="grid grid-cols-1 gap-4">
                <CardSkeleton />
                <ListSkeleton items={3} />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Confirmation Dialog instance */}
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title="Confirm Asset Deletion"
        message="Are you sure you want to retire vehicle Plate number TX-9923? This operation is permanent and cannot be reversed."
        variant="danger"
        confirmLabel="Retire Asset"
        isLoading={dialogLoading}
      />

      {/* Drawer details panel instance */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Operational Log details"
        size="md"
      >
        <div className="space-y-4 select-none">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            This sliding drawer panel displays diagnostic details.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Incident Code:</span>
              <span className="text-slate-700 font-bold">INC-9902</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Reported At:</span>
              <span className="text-slate-700 font-bold">Jul 12, 2026</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Severity level:</span>
              <Badge variant="danger" size="sm">High Severity</Badge>
            </div>
          </div>
        </div>
      </Drawer>
    </PageWrapper>
  );
}

export default Settings;
