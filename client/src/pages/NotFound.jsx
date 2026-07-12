import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function NotFound() {
  return (
    <PageWrapper className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-6">
        <HelpCircle className="w-8 h-8 text-brand-primary" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
        The page you are trying to access does not exist or has been relocated in the platform registry.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-brand-primary hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-primary/10 hover:shadow-lg transition-all"
      >
        Return to Dashboard
      </Link>
    </PageWrapper>
  );
}

export default NotFound;
