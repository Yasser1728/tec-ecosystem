import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BottomNav } from "../../components/layout";
import DashboardWidget from "../../components/tec/DashboardWidget";
import AlertSummary from "../../components/tec/AlertSummary";
import { useLanguage } from "../../hooks/useLanguage";

export default function TEC() {
  const { isRTL } = useLanguage();
  
  return (
    <>
      <Head>
        <title>TEC Dashboard | Titan Elite Commerce</title>
        <meta
          name="description"
          content="TEC Landing & Dashboard - Your central hub for the TEC ecosystem"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pb-16 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-4">
              TEC Dashboard / لوحة تحكم تي إي سي
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Welcome to your TEC Command Center - Your gateway to 24 sovereign
              business domains
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tec/ai-assistant"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                🤖 Launch AI Assistant
              </Link>
              <Link
                href="/domains"
                className="bg-gray-800 border border-[#00ff9d]/20 text-[#00ff9d] px-6 py-3 rounded-lg font-semibold hover:border-[#00ff9d]/50 transition-all"
              >
                🌐 Explore Domains
              </Link>
              <Link
                href="/tec/login"
                className="bg-gray-800 border border-[#00c6ff]/20 text-[#00c6ff] px-6 py-3 rounded-lg font-semibold hover:border-[#00c6ff]/50 transition-all"
              >
                🔐 Login / Register
              </Link>
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <DashboardWidget
              title="Active Services"
              value="3"
              subtitle="Domains you're using"
              icon="🚀"
              color="green"
            />
            <DashboardWidget
              title="Transactions"
              value="12"
              subtitle="Total completed"
              icon="💰"
              color="blue"
            />
            <DashboardWidget
              title="Ecosystem Health"
              value="99.9%"
              subtitle="All systems operational"
              icon="✅"
              color="green"
            />
            <DashboardWidget
              title="Your Tier"
              value="STANDARD"
              subtitle="Upgrade for more features"
              icon="⭐"
              color="purple"
            />
          </div>

          {/* Alert Summary */}
          <div className="mb-8">
            <AlertSummary userId="demo-user" />
          </div>

          {/* Quick Access Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 transition-all">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Unified Access / الوصول الموحد
              </h3>
              <p className="text-gray-400 mb-4">
                Access all 24 sovereign business domains from one portal with
                seamless single sign-on
              </p>
              <Link
                href="/domains"
                className="text-[#00c6ff] hover:text-[#00ff9d] font-semibold"
              >
                View All Domains →
              </Link>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00c6ff]/20 hover:border-[#00c6ff]/50 transition-all">
              <h3 className="text-2xl font-bold text-[#00c6ff] mb-3">
                AI Assistant / المساعد الذكي
              </h3>
              <p className="text-gray-400 mb-4">
                Your intelligent guide to navigate the ecosystem and discover
                opportunities
              </p>
              <Link
                href="/tec/ai-assistant"
                className="text-[#00c6ff] hover:text-[#00ff9d] font-semibold"
              >
                Chat with Assistant →
              </Link>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 transition-all">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-3">
                Strategic Insights / رؤى استراتيجية
              </h3>
              <p className="text-gray-400 mb-4">
                Navigate the TEC ecosystem with expert guidance and data-driven
                recommendations
              </p>
              <Link
                href="/tec/strategy"
                className="text-[#00c6ff] hover:text-[#00ff9d] font-semibold"
              >
                View Strategy →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
