import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import TECNexusAI from "../components/TECNexusAI";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <TECNexusAI />
    </SessionProvider>
  );
}

export default MyApp;
