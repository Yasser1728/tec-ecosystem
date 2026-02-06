import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BottomNav } from "../components/layout";
import ParticlesCanvas from "../components/ParticlesCanvas";
import PiAuthButton from "../components/PiAuthButton";
import { useLanguage } from "../hooks/useLanguage";

export default function Home() {
  const { isRTL } = useLanguage();
  const [piUser, setPiUser] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
    console.log(
      `🌐 TEC Ecosystem running in ${isSandbox ? "SANDBOX" : "MAINNET"} mode`,
    );
  }, []);

  const handlePiAuth = (user) => {
    setPiUser(user);
    console.log("Pi User authenticated:", user);
  };

  const testPiSDK = () => {
    console.log("🧪 Testing Pi SDK...");
    console.log("window.Pi exists:", !!window.Pi);
    if (window.Pi) {
      console.log("Pi SDK methods:", Object.keys(window.Pi));
      console.log("Pi SDK:", window.Pi);
    } else {
      console.error("❌ Pi SDK not found!");
      alert("Pi SDK not loaded! Check console for details.");
    }
  };

  const handlePiPayment = async () => {
    console.log("💰 Payment button clicked");
    setPaymentStatus("⏳ Initializing...");

    const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

    try {
      // Check if Pi SDK exists
      if (!window.Pi) {
        throw new Error("Pi SDK not available. Please open in Pi Browser.");
      }

      // Initialize Pi SDK
      console.log(`🔧 Initializing Pi SDK (sandbox: ${isSandbox})...`);
      await window.Pi.init({
        version: "2.0",
        sandbox: isSandbox,
      });

      // Authenticate
      console.log("🔐 Authenticating...");
      setPaymentStatus("🔐 Authenticating...");

      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        (incompletePayment) => {
          console.log("⚠️ Found incomplete payment:", incompletePayment);
        },
      );

      console.log("✅ Authenticated:", authResult.user.username);
      setPiUser(authResult.user);
      setPaymentStatus(`✅ Authenticated as ${authResult.user.username}`);

      // Create payment
      console.log("💰 Creating payment...");
      setPaymentStatus("💰 Creating payment...");

      const payment = await window.Pi.createPayment(
        {
          amount: 1,
          memo: "TEC Ecosystem - Demo Payment",
          metadata: {
            app: "TEC Ecosystem",
            type: "demo",
            timestamp: new Date().toISOString(),
          },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            console.log("✅ Payment ready for approval:", paymentId);
            console.log("🔧 SDK Mode:", window.piSandboxMode ? "Local Mock" : "Real Pi SDK");
            setPaymentStatus("⏳ Registering payment with Pi Network...");

            // Wait for Pi Network to register the payment
            // This delay allows Pi Network's backend to process the payment creation
            await new Promise((resolve) => setTimeout(resolve, 3000));

            setPaymentStatus("⏳ Approving payment with backend...");

            try {
              console.log("📡 Calling /api/payments/approve for:", paymentId);
              const response = await fetch("/api/payments/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Approval failed:", errorData);
                setPaymentStatus(
                  `❌ Approval failed: ${errorData.error || "Unknown error"}`,
                );
                return;
              }

              const data = await response.json();
              console.log("✅ Payment approved successfully:", data);
              setPaymentStatus(
                "✅ Payment approved! Waiting for blockchain completion...",
              );
            } catch (error) {
              console.error("❌ Approval error:", error);
              setPaymentStatus(`❌ Approval error: ${error.message}`);
            }
          },

          onReadyForServerCompletion: async (paymentId, txid) => {
            console.log("✅ Payment ready for completion:", paymentId, txid);
            console.log("🔧 SDK Mode:", window.piSandboxMode ? "Local Mock" : "Real Pi SDK");
            setPaymentStatus("⏳ Completing payment with backend...");

            try {
              console.log("📡 Calling /api/payments/complete for:", paymentId, txid);
              const response = await fetch("/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Completion failed:", errorData);
                setPaymentStatus(
                  `❌ Completion failed: ${errorData.error || "Unknown error"}`,
                );
                return;
              }

              const data = await response.json();
              console.log("✅ Payment completed successfully:", data);
              setPaymentStatus("✅ Payment successful! 🎉");
            } catch (error) {
              console.error("❌ Completion error:", error);
              setPaymentStatus(`❌ Completion error: ${error.message}`);
            }
          },

          onCancel: (paymentId) => {
            console.log("❌ Payment cancelled by user:", paymentId);
            setPaymentStatus("❌ Payment cancelled");
          },

          onError: (error, payment) => {
            console.error("❌ Payment error:", error, payment);
            setPaymentStatus(
              `❌ Payment error: ${error.message || "Unknown error"}`,
            );
          },
        },
      );

      console.log("Payment object:", payment);
    } catch (error) {
      console.error("❌ Payment flow error:", error);
      setPaymentStatus(`❌ Error: ${error.message}`);
    }
  };

  const domains = [
    {
      name: "FundX.pi",
      path: "/fundx",
      icon: "📊",
      desc: "Elite Investment Strategies",
    },
    {
      name: "Assets.pi",
      path: "/assets",
      icon: "💼",
      desc: "Portfolio Management",
    },
    { name: "NBF.pi", path: "/nbf", icon: "🏦", desc: "Sovereign Banking" },
    {
      name: "Estate.pi",
      path: "/estate",
      icon: "🏠",
      desc: "Luxury Real Estate",
    },
    {
      name: "Explorer.pi",
      path: "/explorer",
      icon: "✈️",
      desc: "Luxury Travel",
    },
    {
      name: "VIP.pi",
      path: "/vip",
      icon: "👑",
      desc: "Exclusive Opportunities",
    },
    {
      name: "Elite.pi",
      path: "/elite",
      icon: "⭐",
      desc: "Premium Consulting",
    },
    { name: "Nexus.pi", path: "/nexus", icon: "🔗", desc: "AI Integration" },
  ];

  return (
    <>
      <Head>
        <title>TEC - Titan Elite Commerce | 24 Elite Business Services</title>
        <meta
          name="description"
          content="Titan Elite Commerce - Private marketplace for elite opportunities across 24 business services powered by Pi Network"
        />
        <meta
          name="keywords"
          content="TEC, Titan Elite Commerce, Pi Network, luxury marketplace, elite commerce, blockchain"
        />
      </Head>

      <Header />

      <main className="relative min-h-screen bg-gray-900 text-white pb-16 md:pb-0" dir={isRTL ? 'rtl' : 'ltr'}>
        <ParticlesCanvas />

        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
            TEC Ecosystem
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Titan Elite Commerce
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            24 Independent Luxury Business Units | Private Marketplace | Powered
            by Pi Network
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/ecosystem"
              className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              View All 21 Business Units
            </Link>
            <Link
              href="/tec/hub"
              className="border border-[#00ff9d] text-[#00ff9d] px-8 py-3 rounded-lg font-semibold hover:bg-[#00ff9d]/10 transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>

          {/* Pi Network Integration */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#00ff9d] mb-4 text-center">
                🌐 Pi Network Integration
              </h3>

              {/* Pi Auth */}
              <div className="mb-6">
                <PiAuthButton
                  onAuthSuccess={handlePiAuth}
                  onAuthError={(error) => console.error("Auth error:", error)}
                />
                {piUser && (
                  <div className="mt-3 text-sm text-gray-400 text-center">
                    ✅ Authenticated as: {piUser.username}
                  </div>
                )}
              </div>

              {/* Pi Payment Demo */}
              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-400 text-sm mb-4 text-center">
                  {process.env.NEXT_PUBLIC_PI_SANDBOX === "true"
                    ? "💡 Sandbox Mode: Test payments without real Pi"
                    : "🌐 Mainnet Mode: Real Pi payments"}
                </p>

                {/* Test Button */}
                <button
                  onClick={testPiSDK}
                  className="w-full mb-3 bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 text-sm"
                >
                  🧪 Test Pi SDK (Check Console)
                </button>

                {/* Payment Button */}
                <button
                  onClick={handlePiPayment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  💎 Pay 1 Pi - Demo Payment
                </button>
                {paymentStatus && (
                  <div className="mt-3 text-sm text-gray-400 text-center">
                    {paymentStatus}
                  </div>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                {process.env.NEXT_PUBLIC_PI_SANDBOX === "true"
                  ? "💡 Sandbox Mode: Test payments without real Pi"
                  : "🌐 Mainnet Mode: Real Pi payments"}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Elite Business Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain) => (
              <Link
                key={domain.name}
                href={domain.path}
                className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 hover:border-[#00ff9d] hover:shadow-lg hover:shadow-[#00ff9d]/20 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{domain.icon}</div>
                <h3 className="text-xl font-bold text-[#00ff9d] mb-2 group-hover:text-[#00c6ff] transition-colors">
                  {domain.name}
                </h3>
                <p className="text-gray-400 text-sm">{domain.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/tec/overview"
              className="text-[#00ff9d] hover:text-[#00c6ff] transition-colors"
            >
              View all 24 services →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Private Marketplace</h3>
              <p className="text-gray-400">
                No public catalogs. All deals are curated and brokered.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">Elite Focus</h3>
              <p className="text-gray-400">
                Exclusive opportunities for high-net-worth individuals.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">Pi Network Integration</h3>
              <p className="text-gray-400">
                Sovereign settlements using Pi cryptocurrency.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
