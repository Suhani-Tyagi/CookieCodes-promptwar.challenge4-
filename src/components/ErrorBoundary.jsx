import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — catches render errors in child components and shows a graceful fallback.
 * Prevents a single broken component from crashing the entire application.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you would send this to an error monitoring service (e.g. Sentry)
    if (process.env.NODE_ENV !== 'test') {
      console.error('[ArenaAssist] Component error caught by ErrorBoundary:', error, info);
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-10 rounded-2xl border border-rose-800/40 bg-rose-950/10 text-center gap-4"
        >
          <AlertTriangle className="w-10 h-10 text-rose-500" aria-hidden="true" />
          <div>
            <h2 className="font-extrabold text-rose-400 text-lg mb-1">Something went wrong</h2>
            <p className="text-zinc-400 text-sm max-w-sm">
              This section encountered an unexpected error. You can try refreshing it or continue using the rest of ArenaAssist.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
