'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-6">🐟</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-text-muted mb-6">
          Oops! It seems like you've swum into uncharted waters. The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
}