import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Truck, Bell, User, Palette, Info,
  Save, RotateCcw, Globe, MapPin, Phone, Mail,
  ChevronRight, Shield, Clock, Gauge, Languages,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/utils';
import { APP_META } from '@/constants';
import toast from 'react-hot-toast';

const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'fleet', label: 'Fleet Preferences', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
];

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
];

const DISTANCE_OPTIONS = [
  { value: 'km', label: 'Kilometers (km)' },
  { value: 'mi', label: 'Miles (mi)' },
];

const FUEL_UNIT_OPTIONS = [
  { value: 'liters', label: 'Liters (L)' },
  { value: 'gallons', label: 'Gallons (gal)' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'INR', label: 'Indian Rupee (INR)' },
  { value: 'AED', label: 'UAE Dirham (AED)' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English (US)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ar', label: 'العربية' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // General Settings
  const [companyName, setCompanyName] = useState('TransitOps Operations Ltd.');
  const [companyAddress, setCompanyAddress] = useState('1200 Fleet Drive, New York, NY 10001');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 800-1234');
  const [companyEmail, setCompanyEmail] = useState('operations@transitops.com');
  const [timezone, setTimezone] = useState('America/New_York');

  // Fleet Preferences
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [fuelUnit, setFuelUnit] = useState('liters');
  const [currency, setCurrency] = useState('USD');
  const [maintenanceAlert, setMaintenanceAlert] = useState(true);
  const [lowFuelAlert, setLowFuelAlert] = useState(true);
  const [autoAssignTrips, setAutoAssignTrips] = useState(false);
  const [gpsTracking, setGpsTracking] = useState(true);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [maintenanceNotifs, setMaintenanceNotifs] = useState(true);
  const [tripNotifs, setTripNotifs] = useState(true);
  const [fuelNotifs, setFuelNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Appearance
  const [language, setLanguage] = useState('en');
  const [densityMode, setDensityMode] = useState('comfortable');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    toast.success('Settings saved successfully', { icon: '✅' });
  };

  const handleReset = () => {
    toast('Settings reset to defaults', { icon: '↩️' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <Alert variant="info" title="Architecture Mode">
              Settings are frontend-only. Connect the settings service to persist preferences to your backend.
            </Alert>
            <Card className="space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-primary" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  prefixIcon={Building2}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  prefixIcon={Mail}
                />
                <Input
                  label="Phone Number"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  prefixIcon={Phone}
                />
                <Select
                  label="Timezone"
                  options={TIMEZONE_OPTIONS}
                  value={timezone}
                  onChange={setTimezone}
                />
              </div>
              <Textarea
                label="Company Address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                rows={2}
              />
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-primary" />
                Regional Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Currency" options={CURRENCY_OPTIONS} value={currency} onChange={setCurrency} />
                <Select label="Distance Unit" options={DISTANCE_OPTIONS} value={distanceUnit} onChange={setDistanceUnit} />
                <Select label="Fuel Unit" options={FUEL_UNIT_OPTIONS} value={fuelUnit} onChange={setFuelUnit} />
              </div>
            </Card>
          </div>
        );

      case 'fleet':
        return (
          <Card className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-primary" />
              Fleet Operation Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Maintenance Due Alerts', desc: 'Notify when vehicles approach scheduled maintenance intervals', value: maintenanceAlert, onChange: setMaintenanceAlert },
                { label: 'Low Fuel Threshold Alerts', desc: 'Alert dispatchers when vehicle fuel drops below 15%', value: lowFuelAlert, onChange: setLowFuelAlert },
                { label: 'GPS Live Tracking', desc: 'Enable real-time GPS telemetry for all active vehicles', value: gpsTracking, onChange: setGpsTracking },
                { label: 'Auto-Assign Trips', desc: 'Automatically assign trips to available drivers based on proximity', value: autoAssignTrips, onChange: setAutoAssignTrips },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-subtle last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Alert Thresholds</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Low Fuel Alert Threshold (%)" type="number" defaultValue={15} prefixIcon={Gauge} />
                <Input label="Maintenance Alert (km before)" type="number" defaultValue={500} prefixIcon={Truck} />
              </div>
            </div>
          </Card>
        );

      case 'notifications':
        return (
          <div className="space-y-5">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-primary" />
                Delivery Channels
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'In-App Notifications', desc: 'Receive notifications inside the platform', value: inAppNotifs, onChange: setInAppNotifs },
                  { label: 'Email Notifications', desc: 'Receive daily summary and critical alerts via email', value: emailNotifs, onChange: setEmailNotifs },
                  { label: 'SMS Notifications', desc: 'Get urgent alerts on your phone via SMS', value: smsNotifs, onChange: setSmsNotifs },
                  { label: 'Weekly Digest', desc: 'Get a comprehensive weekly performance summary', value: weeklyDigest, onChange: setWeeklyDigest },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-subtle last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                Notification Categories
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Maintenance Alerts', desc: 'Overdue and upcoming maintenance notifications', value: maintenanceNotifs, onChange: setMaintenanceNotifs },
                  { label: 'Trip Updates', desc: 'Dispatch confirmations, delays, and completions', value: tripNotifs, onChange: setTripNotifs },
                  { label: 'Fuel & Expense Alerts', desc: 'High spend detection and fuel threshold alerts', value: fuelNotifs, onChange: setFuelNotifs },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-subtle last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onChange={item.onChange} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-5">
            <Card className="space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue="Alex Mercer" />
                <Input label="Email Address" type="email" defaultValue="admin@transitops.com" prefixIcon={Mail} />
                <Input label="Phone Number" defaultValue="+1 (555) 012-3456" prefixIcon={Phone} />
                <Input label="Department" defaultValue="Operations" />
              </div>
            </Card>

            <Card className="space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-primary" />
                Password & Security
              </h3>
              <Alert variant="info" title="Backend Required">
                Password change requires backend integration. Connect your auth service to enable this functionality.
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60 pointer-events-none">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <div />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" isDisabled className="w-fit">
                Update Password (Backend Required)
              </Button>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-5">
            <Card className="space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-brand-primary" />
                Language & Display
              </h3>
              <Select
                label="Interface Language"
                options={LANGUAGE_OPTIONS}
                value={language}
                onChange={setLanguage}
              />
              <Alert variant="info" title="Coming Soon">
                Dark mode, high-contrast mode, and custom theming are planned for the next release.
              </Alert>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-subtle pb-3">Display Density</h3>
              <div className="grid grid-cols-3 gap-3">
                {['compact', 'comfortable', 'spacious'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDensityMode(mode)}
                    className={cn(
                      'p-4 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer',
                      densityMode === mode
                        ? 'border-brand-primary bg-blue-50 text-brand-primary'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'about':
        return (
          <Card className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Truck className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">{APP_META.name}</h2>
                <p className="text-sm text-slate-500">{APP_META.tagline}</p>
                <Badge variant="primary" size="sm" className="mt-1">v{APP_META.version}</Badge>
              </div>
            </div>

            <div className="border-t border-subtle pt-5 space-y-3">
              {[
                { label: 'Version', value: APP_META.version },
                { label: 'Build', value: 'Production (Hackathon Build)' },
                { label: 'Framework', value: 'React 19 + Vite 8 + Tailwind CSS v4' },
                { label: 'Charts', value: 'Recharts v3 + Framer Motion v12' },
                { label: 'License', value: 'Enterprise — All Rights Reserved' },
                { label: 'Copyright', value: `© ${APP_META.year} TransitOps Platform` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-subtle last:border-0">
                  <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                  <span className="text-xs font-bold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <PageWrapper title="Settings">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage company information, fleet preferences, and account settings.
            </p>
          </div>
          {activeTab !== 'about' && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button variant="outline" size="sm" leftIcon={RotateCcw} onClick={handleReset}>
                Reset
              </Button>
              <Button variant="primary" size="sm" leftIcon={Save} isLoading={isSaving} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <div className="lg:w-52 shrink-0">
            <nav className="space-y-1">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
                      activeTab === tab.id
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', activeTab === tab.id ? 'text-white' : 'text-slate-400')} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Settings;
