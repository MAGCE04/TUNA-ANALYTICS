import '../app/globals.css';

// This is a fallback for the Pages Router
// It will redirect to the App Router
export default function MyApp({ Component, pageProps }) {
  if (typeof window !== 'undefined') {
    // Client-side only
    window.location.href = '/';
    return null;
  }
  
  // Server-side rendering
  return <Component {...pageProps} />;
}