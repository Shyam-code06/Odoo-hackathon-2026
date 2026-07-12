import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Unauthorized() {
  return (
    <PageWrapper className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-danger mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Security Access Restricted</h1>
      <p className="text-xs text-slate-400 mt-2.5 max-w-sm leading-relaxed">
        Your account role does not have administrative clearance to access this console page. Please contact the fleet coordinator if you require access.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
      >
        Back to Dashboard
      </Link>
    </PageWrapper>
  );
}

export default Unauthorized;
