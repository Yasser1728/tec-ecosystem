import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import TECNexusAI from '../components/TECNexusAI';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <TECNexusAI />
    </>
  );
}

export default appWithTranslation(MyApp);
