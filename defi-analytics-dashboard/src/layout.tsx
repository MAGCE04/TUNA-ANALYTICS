import React from 'react';

const Layout = ({ children }) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#0a0e17',
      color: '#f8fafc',
      minHeight: '100vh',
    }}>
      <header style={{
        padding: '20px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', marginRight: '10px' }}>🐟</div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>DeFi Tuna Analytics</h1>
        </div>
        <nav>
          <a href="https://github.com/MAGCE04/TUNA-ANALYTICS" style={{
            color: '#f8fafc',
            textDecoration: 'none',
            marginLeft: '20px',
          }}>
            GitHub
          </a>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
      <footer style={{
        padding: '20px',
        borderTop: '1px solid #1e293b',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '14px',
      }}>
        © 2023 DeFi Tuna Analytics. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;