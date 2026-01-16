import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { USER_TIERS, TIER_PRICING, TIER_BENEFITS } from "../lib/roles";
import { logger } from '../lib/utils/logger.js';

export default function Upgrade() {
  const { data: session } = useSession();
  const router = useRouter();
  const { required, from } = router.query;
  const [selectedTier, setSelectedTier] = useState(
    required || USER_TIERS.PREMIUM,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTier = session?.user?.tier || USER_TIERS.GUEST;

  const tiers = [
    {
      id: USER_TIERS.STANDARD,
      name: "Standard",
      price: 0,
      period: "Forever Free",
      icon: "🌟",
      color: "from-blue-500 to-cyan-500",
      popular: false,
      benefits: TIER_BENEFITS.STANDARD,
    },
    {
      id: USER_TIERS.PREMIUM,
      name: "Premium",
      price: TIER_PRICING.PREMIUM,
      period: "per month",
      icon: "💎",
      color: "from-purple-500 to-pink-500",
      popular: true,
      benefits: TIER_BENEFITS.PREMIUM,
    },
    {
      id: USER_TIERS.ENTERPRISE,
      name: "Enterprise",
      price: TIER_PRICING.ENTERPRISE,
      period: "per month",
      icon: "🏢",
      color: "from-orange-500 to-red-500",
      popular: false,
      benefits: TIER_BENEFITS.ENTERPRISE,
    },
  ];

  const handleUpgrade = async (tier) => {
    if (!session) {
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`,
      );
      return;
    }

    if (tier === USER_TIERS.STANDARD) {
      return; // Already free
    }

    setIsProcessing(true);

    try {
      // Create Pi payment
      const payment = await window.Pi.createPayment(
        {
          amount: TIER_PRICING[tier],
          memo: `TEC Ecosystem - ${tier} Subscription`,
          metadata: {
            type: "subscription",
            tier: tier,
            userId: session.user.id,
          },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            // Approve payment on server
            const response = await fetch("/api/subscriptions/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                tier,
                userId: session.user.id,
              }),
            });

            if (response.ok) {
              router.push("/dashboard?upgraded=true");
            }
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            console.log("Payment completed:", paymentId, txid);
          },
          onCancel: () => {
            setIsProcessing(false);
          },
          onError: (error) => {
            console.error("Payment error:", error);
            setIsProcessing(false);
          },
        },
      );
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to process upgrade. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upgrade Your Plan - TEC Ecosystem</title>
        <meta
          name="description"
          content="Choose the perfect plan for your needs"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400">
              Unlock the full potential of TEC Ecosystem
            </p>
            {currentTier && (
              <p className="text-sm text-gray-500 mt-2">
                Current Plan:{" "}
                <span className="text-[#00ff9d] font-semibold">
                  {currentTier}
                </span>
              </p>
            )}
          </div>

          {/* Required Tier Notice */}
          {required && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-400 text-center">
                ⚠️ <strong>{required}</strong> tier required to access this
                feature
              </p>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-gray-800 border ${
                  tier.popular ? "border-[#00ff9d]" : "border-gray-700"
                } rounded-xl p-8 ${
                  tier.popular ? "transform scale-105" : ""
                } transition-all hover:border-[#00ff9d]`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="text-5xl mb-4 text-center">{tier.icon}</div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-center mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  {tier.price === 0 ? (
                    <div className="text-3xl font-bold text-[#00ff9d]">
                      Free
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        <span className="text-[#00ff9d]">{tier.price}</span>
                        <span className="text-xl text-gray-400"> π</span>
                      </div>
                      <div className="text-sm text-gray-400">{tier.period}</div>
                    </>
                  )}
                </div>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-[#00ff9d] mt-1">✓</span>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isProcessing || currentTier === tier.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    currentTier === tier.id
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : tier.popular
                        ? "bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 hover:shadow-lg"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : currentTier === tier.id ? (
                    "Current Plan"
                  ) : tier.price === 0 ? (
                    "Get Started"
                  ) : (
                    `Upgrade to ${tier.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect immediately.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-400">
                  We accept Pi cryptocurrency through the Pi Network. All
                  transactions are secure and verified on the blockchain.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-400">
                  The Standard plan is free forever! You can explore the
                  platform and upgrade when you're ready for more features.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-400">
                  Yes, you can cancel anytime from your dashboard. You'll retain
                  access until the end of your billing period.
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          {from && (
            <div className="text-center mt-12">
              <Link
                href={decodeURIComponent(from)}
                className="text-gray-400 hover:text-[#00ff9d] transition-colors"
              >
                ← Back to previous page
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
