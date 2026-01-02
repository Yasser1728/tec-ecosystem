import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * Generate a secure random referral code using Web Crypto API
 */
function generateSecureReferralCode() {
  // Use Web Crypto API for secure random generation
  const array = new Uint8Array(6);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
    // Convert to hex string for consistent length (12 chars) then take 8
    const hexString = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    return 'TEC-' + hexString.substring(0, 8);
  }
  // Fallback for SSR (will be replaced on client mount)
  return 'TEC-XXXXXXXX';
}

export default function Referral() {
  const [referralCode, setReferralCode] = useState('TEC-XXXXXXXX');
  const [copied, setCopied] = useState(false);

  // Generate secure referral code on client side only
  useEffect(() => {
    setReferralCode(generateSecureReferralCode());
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://tec-ecosystem.vercel.app?ref=${referralCode}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rewards = [
    {
      tier: "Bronze",
      icon: "🥉",
      bonus: "10 Pi",
      color: "from-orange-900 to-red-900",
    },
    {
      tier: "Silver",
      icon: "🥈",
      bonus: "25 Pi",
      color: "from-gray-700 to-gray-600",
    },
    {
      tier: "Gold",
      icon: "🥇",
      bonus: "50 Pi",
      color: "from-yellow-900 to-orange-900",
    },
    {
      tier: "Platinum",
      icon: "💎",
      bonus: "100 Pi",
      color: "from-purple-900 to-pink-900",
    },
  ];

  const milestones = [
    {
      referrals: 5,
      reward: "Upgrade to next tier (1 month free)",
      icon: "🎁",
    },
    {
      referrals: 10,
      reward: "Upgrade to next tier (3 months free)",
      icon: "🎉",
    },
    {
      referrals: 25,
      reward: "Gold tier for life + 500 Pi bonus",
      icon: "👑",
    },
    {
      referrals: 50,
      reward: "Platinum tier for life + 1000 Pi bonus",
      icon: "💎",
    },
  ];

  return (
    <>
      <Head>
        <title>Referral Program | TEC - Earn Rewards</title>
        <meta
          name="description"
          content="Refer friends to TEC and earn Pi rewards. Both you and your referrals benefit!"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              🎁 Referral Program
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Share TEC with your network and earn Pi rewards. The more you
              refer, the more you earn!
            </p>
          </div>

          {/* Your Referral Code */}
          <div className="bg-gradient-to-br from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d]/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Your Referral Code
            </h2>
            <div className="flex items-center gap-4 max-w-2xl mx-auto">
              <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 font-mono text-xl text-center">
                {referralCode}
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
              >
                {copied ? "✓ Copied!" : "📋 Copy Link"}
              </button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Share this link with friends and earn rewards when they sign up
            </p>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="font-bold mb-2">Share Your Link</h3>
                <p className="text-sm text-gray-400">
                  Send your unique referral link to friends
                </p>
              </div>
              <div className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="font-bold mb-2">They Sign Up</h3>
                <p className="text-sm text-gray-400">
                  Your friend creates a TEC account
                </p>
              </div>
              <div className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="font-bold mb-2">Both Get Rewards</h3>
                <p className="text-sm text-gray-400">
                  You both receive Pi bonuses
                </p>
              </div>
              <div className="bg-gray-800 border border-[#00ff9d]/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">4️⃣</div>
                <h3 className="font-bold mb-2">Keep Earning</h3>
                <p className="text-sm text-gray-400">
                  Unlimited referrals, unlimited rewards
                </p>
              </div>
            </div>
          </div>

          {/* Rewards by Tier */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Rewards by Membership Tier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.tier}
                  className={`bg-gradient-to-br ${reward.color} border border-white/10 rounded-lg p-6 text-center`}
                >
                  <div className="text-5xl mb-3">{reward.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{reward.tier}</h3>
                  <div className="text-3xl font-bold text-[#00ff9d] mb-2">
                    {reward.bonus}
                  </div>
                  <p className="text-sm text-gray-300">per referral</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 mt-6">
              Your referral also gets a welcome bonus based on their tier!
            </p>
          </div>

          {/* Milestones */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Referral Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-yellow-500/30 rounded-lg p-6 flex items-start gap-4"
                >
                  <div className="text-4xl">{milestone.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                        {milestone.referrals} Referrals
                      </span>
                    </div>
                    <p className="text-gray-300">{milestone.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Your Referral Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00ff9d] mb-2">0</div>
                <div className="text-sm text-gray-400">Total Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00ff9d] mb-2">
                  0 Pi
                </div>
                <div className="text-sm text-gray-400">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00ff9d] mb-2">0</div>
                <div className="text-sm text-gray-400">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00ff9d] mb-2">5</div>
                <div className="text-sm text-gray-400">Next Milestone</div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">Program Terms</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#00ff9d] mt-1">•</span>
                <span>
                  Referral bonuses are credited within 24 hours of successful
                  signup
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff9d] mt-1">•</span>
                <span>Both referrer and referee must have active accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff9d] mt-1">•</span>
                <span>Milestone rewards are cumulative and permanent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff9d] mt-1">•</span>
                <span>No limit on number of referrals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00ff9d] mt-1">•</span>
                <span>
                  TEC reserves the right to modify program terms with notice
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold mb-4">Start Earning Today</h2>
            <p className="text-gray-400 mb-8">
              Share TEC with your network and watch your rewards grow
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
              >
                Copy Referral Link
              </button>
              <Link
                href="/membership"
                className="border border-[#00ff9d] text-[#00ff9d] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#00ff9d]/10 transition-all"
              >
                Upgrade Membership
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
