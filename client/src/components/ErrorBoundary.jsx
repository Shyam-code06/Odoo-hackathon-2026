import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * React Error Boundary — catches uncaught JS errors in the component tree.
 * Renders a friendly fallback UI with retry + navigation options.
 * Logging placeholder: replace console.error with your logging service (Sentry, Datadog, etc.)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // ── Logging Placeholder ─────────────────────────────────────────────
    // Replace with: Sentry.captureException(error, { extra: errorInfo });
    // Or:           logger.error('ErrorBoundary caught:', error, errorInfo);
    // ────────────────────────────────────────────────────────────────────
    console.error('[ErrorBoundary] Caught unhandled error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-md text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-brand-danger" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
              An unexpected error occurred in the application. Our team has been notified.
            </p>

            {/* Error detail (dev mode) */}
            {this.state.error && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Error Details
                </p>
                <p className="text-xs text-slate-600 font-mono break-all leading-relaxed">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-primary/10 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Go Home
              </a>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 font-semibold">
              TransitOps Platform — Error Reference: EB-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
