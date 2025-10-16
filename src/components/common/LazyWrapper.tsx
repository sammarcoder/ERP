// components/common/LazyWrapper.tsx
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazyWrapperProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  errorFallback 
}) => {
  const defaultFallback = fallback || (
    <div className="flex items-center justify-center h-32">
      <LoadingSpinner size="medium" message="Loading component..." />
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy load heavy components
export const LazyMultiSelectItemTable = lazy(() => import('../MultiSelectItemTable'));
export const LazySelectableTable = lazy(() => import('../SelectableTable'));
export const LazyUomConverter = lazy(() => import('../UomConverter'));

// HOC for lazy loading
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <LazyWrapper fallback={fallback}>
      <Component {...props} ref={ref} />
    </LazyWrapper>
  ));
};

export default LazyWrapper;
