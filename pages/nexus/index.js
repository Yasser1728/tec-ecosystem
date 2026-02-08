import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BottomNav } from "../../components/layout";
import IntentDetector from "../../components/nexus/IntentDetector";
import ServiceRouter from "../../components/nexus/ServiceRouter";
import { useLanguage } from "../../hooks/useLanguage";

export default function Nexus() {
  const { language } = useLanguage();

  return (
    <>
      <Head>
        <title>Nexus.pi - {language === 'ar' ? 'مركز التحكم الذكي' : 'AI-Powered Control Center'} | TEC</title>
        <meta
          name="description"
          content={language === 'ar' 
            ? "الوصول إلى جميع خدمات TEC من مكان واحد" 
            : "Access all TEC services from one intelligent hub"}
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white pb-20">
        {/* Hero */}
        <section className="relative py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🌐 Nexus.pi
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-2">
              {language === 'ar' ? 'مركز التحكم الذكي' : 'AI-Powered Control Center'}
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'اتصل. نسّق. تكامل. استفد من الذكاء الاصطناعي لتبسيط عملياتك.'
                : 'Connect. Coordinate. Integrate. Leverage AI to streamline your operations.'}
            </p>
          </div>
        </section>

        {/* Intent Detector */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <IntentDetector />
          </div>
        </section>

        {/* Service Router */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <ServiceRouter />
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
