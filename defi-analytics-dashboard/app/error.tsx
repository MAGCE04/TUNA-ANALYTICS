'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <div className="mb-6 text-5xl font-bold text-danger">Error</div>
        
        <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
        
        <p className="mb-8 text-text-muted max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Try Again
          </button>
          
          <Link 
            href="/"
            className="btn btn-outline"
          >
            Return to Dashboard
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-card rounded-lg max-w-md mx-auto">
          <p className="text-sm text-text-muted mb-2">
            Error details:
          </p>
          <p className="text-xs text-danger font-mono bg-danger/10 p-2 rounded overflow-auto text-left">
            {error.message || "Unknown error occurred"}
          </p>
        </div>
      </div>
    </div>
  );
}