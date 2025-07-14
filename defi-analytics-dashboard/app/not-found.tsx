'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  // Auto-redirect to home page after 5 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="w-24 h-24 relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-md"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🐟</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-text-muted max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. 
        You'll be redirected to the home page in a few seconds.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="btn btn-primary"
        >
          Go to Dashboard
        </Link>
        
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-outline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}