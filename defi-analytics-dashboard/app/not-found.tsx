'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Log the 404 error for debugging
    console.error('404 page not found error occurred');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <div className="mb-8 text-6xl font-bold text-primary">404</div>
        
        <h1 className="mb-4 text-2xl font-bold">Page Not Found</h1>
        
        <p className="mb-8 text-text-muted max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="btn btn-primary"
          >
            Return to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-12 p-4 bg-card rounded-lg max-w-md mx-auto">
          <p className="text-sm text-text-muted">
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}