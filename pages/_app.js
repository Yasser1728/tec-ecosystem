import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "../contexts/LanguageContext";
import TECNexusAI from "../components/TECNexusAI";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <LanguageProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <TECNexusAI />
      </SessionProvider>
    </LanguageProvider>
  );
}

export default MyApp;
