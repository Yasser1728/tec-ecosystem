import '../styles/globals.css';
import TECNexusAI from '../components/TECNexusAI';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Load Pi Sandbox for development/testing
    if (typeof window !== 'undefined') {
      import('../lib/pi-sandbox').then(() => {
        console.log('🧪 Pi Sandbox loaded');
      });
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <TECNexusAI />
    </>
  );
}

export default MyApp;
