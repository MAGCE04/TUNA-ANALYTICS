import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#0a0e17',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      margin: 0,
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐟</div>
      <h1 style={{ marginBottom: '20px' }}>DeFi Tuna Analytics Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#94a3b8', maxWidth: '600px' }}>
        Welcome to the DeFi Tuna Analytics Dashboard!
      </p>
      
      <div style={{
        display: 'inline-block',
        width: '50px',
        height: '50px',
        border: '4px solid rgba(0, 228, 255, 0.3)',
        borderRadius: '50%',
        borderTopColor: '#00e4ff',
        animation: 'spin 1s ease-in-out infinite'
      }}></div>
      
      <p style={{ marginBottom: '30px', color: '#94a3b8', maxWidth: '600px' }}>
        Our dashboard is currently being updated. Please check back soon for an enhanced experience.
      </p>
      
      <a href="https://github.com/MAGCE04/TUNA-ANALYTICS" style={{
        display: 'inline-block',
        backgroundColor: '#00e4ff',
        color: '#0a0e17',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        marginTop: '20px'
      }}>
        View on GitHub
      </a>
      
      <p style={{ marginTop: '40px', fontSize: '14px' }}>
        © 2023 DeFi Tuna Analytics. All rights reserved.
      </p>
      
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));