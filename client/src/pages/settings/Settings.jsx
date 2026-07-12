import { Sliders, Shield, Key } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Settings() {
  const sections = [
    { name: 'General Parameters', desc: 'Configure platform timezone, measurements, and notifications.', icon: Sliders },
    { name: 'Access Permissions (RBAC)', desc: 'Manage user access levels (Admin, Operator, Driver).', icon: Shield },
    { name: 'Developer APIs', desc: 'Integration endpoints, API webhooks, and security tokens.', icon: Key },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Adjust platform preferences, security, integrations, and RBAC control.</p>
        </div>

        {/* Configuration list widgets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-premium divide-y divide-subtle">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div 
                key={idx}
                className="flex items-start gap-4 p-6 hover:bg-brand-bg-secondary/40 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-655 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-850">{section.name}</h4>
                  <p className="text-xs text-slate-450 leading-relaxed">{section.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Settings;
