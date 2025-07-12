import { useEffect } from 'react';

export default function Custom404() {
  useEffect(() => {
    // Redirect to the home page after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    
    return () => clearTimeout(timer);
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
        <div style={{ 
          fontSize: '5rem', 
          fontWeight: 'bold', 
          color: '#38bdf8', 
          marginBottom: '1rem' 
        }}>404</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
        <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
          Sorry, we couldn't find the page you're looking for. 
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}