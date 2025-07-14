import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center text-center px-4">
      <Head>
        <title>Page Not Found - DeFi Tuna Analytics</title>
      </Head>
      
      <div className="w-24 h-24 relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-md"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🐟</span>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-text-muted max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link href="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}