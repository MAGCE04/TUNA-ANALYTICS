import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the App Router home page
    window.location.href = '/';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>DeFi Tuna Analytics</h1>
        <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Loading dashboard...</p>
      </div>
    </div>
  );
}