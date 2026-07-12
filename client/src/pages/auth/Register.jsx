import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ArrowLeft, Mail, Info, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center font-sans p-6">
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-80 h-80 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative overflow-hidden"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Transit<span className="text-brand-primary">Ops</span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest -mt-0.5">Enterprise Platform</p>
          </div>
        </div>

        {/* Informational Box */}
        <div className="space-y-6 text-center">
          <div className="w-14 h-14 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Info className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Invite-Only Access</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              TransitOps operates on a secure, multi-tenant enterprise organization model. 
              Self-service registration is disabled to protect tenant data boundaries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">How to get an account?</h4>
              <p className="text-xs text-amber-700 leading-normal mt-1">
                Your company's **Fleet Manager** acts as the Organization Admin and must register your account from their User Management panel. 
                Contact them to request an email invitation.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-primary hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-primary/20 hover:shadow-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Login
            </button>
            <a
              href="mailto:support@transitops.com?subject=TransitOps%20Organization%20Registration"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8">
          © {new Date().getFullYear()} TransitOps · Enterprise Fleet Platform
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
