'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Navigation items
const navItems = [
  { path: '/', label: '🏠 Overview', emoji: '🏠' },
  { path: '/revenue', label: '💰 Revenue', emoji: '💰' },
  { path: '/liquidations', label: '🌊 Liquidations', emoji: '🌊' },
  { path: '/orders', label: '📊 Orders', emoji: '📊' },
  { path: '/pools', label: '🏊‍♂️ Pools', emoji: '🏊‍♂️' },
  { path: '/users', label: '👥 Users', emoji: '👥' },
  { path: '/wallets', label: '👛 Wallets', emoji: '👛' },
];

// Navigation link component with active state
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`nav-link whitespace-nowrap transition-all ${
        isActive 
          ? 'nav-link-active' 
          : 'text-text-muted hover:text-text hover:bg-card-hover'
      }`}
    >
      {label}
    </Link>
  );
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              {/* Logo */}
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-md"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🐟</span>
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">DeFi Tuna Analytics</span>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success mr-2 pulse"></div>
                <span className="text-sm text-text-muted">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-card/50 backdrop-blur-md border-b border-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
            {navItems.map((item) => (
              <NavLink key={item.path} href={item.path} label={item.label} />
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-1 relative">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-0">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-md border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-text-muted mb-2">
              Data updates every 12 hours. Last updated displayed on each page.
            </p>
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} DeFi Tuna Analytics • 
              <span className="ml-1">Built with 🐟 on Solana</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}