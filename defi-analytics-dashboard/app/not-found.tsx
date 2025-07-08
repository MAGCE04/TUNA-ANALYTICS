'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
      <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
      <p className="text-text-muted mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
}