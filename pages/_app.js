import '../styles/globals.css';
import TECNexusAI from '../components/TECNexusAI';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <TECNexusAI />
    </>
  );
}

export default MyApp;
