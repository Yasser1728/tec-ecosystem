import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "../contexts/LanguageContext";
import TECNexusAI from "../components/TECNexusAI";
import AssistantFloatingWidget from "../components/tec/AssistantFloatingWidget";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <LanguageProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <TECNexusAI />
        <AssistantFloatingWidget />
      </SessionProvider>
    </LanguageProvider>
  );
}

export default MyApp;
