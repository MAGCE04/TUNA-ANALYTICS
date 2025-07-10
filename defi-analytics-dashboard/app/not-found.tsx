'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-4">🐟</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-text-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}