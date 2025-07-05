import React, { Suspense } from "react";

interface LazyRouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">Failed to load the page</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Page
      </button>
    </div>
  </div>
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
