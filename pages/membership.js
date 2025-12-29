import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Membership() {
  const tiers = [
    {
      name: 'Bronze',
      icon: '🥉',
      price: 'Free',
      priceValue: 0,
      color: 'from-orange-900 to-red-900',
      borderColor: 'border-orange-500',
      features: [
        'Access to guides & content',
        'Basic TEC Nexus AI',
        'Request consultation (48h response)',
        'Standard deals',
        'Email support'
      ]
    },
    {
      name: 'Silver',
      icon: '🥈',
      price: '100 Pi/month',
      priceValue: 100,
      color: 'from-gray-700 to-gray-600',
      borderColor: 'border-gray-400',
      popular: false,
      features: [
        'All Bronze benefits',
        'Priority consultation (24h response)',
        'Access to exclusive deals',
        'Monthly market reports',
        '5% discount on brokerage fees',
        'Priority email support'
      ]
    },
    {
      name: 'Gold',
      icon: '🥇',
      price: '500 Pi/month',
      priceValue: 500,
      color: 'from-yellow-900 to-orange-900',
      borderColor: 'border-yellow-500',
      popular: true,
      features: [
        'All Silver benefits',
        'Immediate consultation (2h response)',
        'Dedicated account manager',
        'Early access to opportunities',
        '10% discount on brokerage fees',
        'Quarterly strategy sessions',
        '24/7 priority support'
      ]
    },
    {
      name: 'Platinum',
      icon: '💎',
      price: '2000 Pi/month',
      priceValue: 2000,
      color: 'from-purple-900 to-pink-900',
      borderColor: 'border-purple-500',
      features: [
        'All Gold benefits',
        '24/7 concierge service',
        'Access to ALL 24 business services',
        'Custom deal structuring',
        '15% discount on brokerage fees',
        'Monthly 1-on-1 with TEC executives',
        'Exclusive events & networking',
        'White-glove service'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Membership Tiers | TEC - Titan Elite Commerce</title>
        <meta name="description" content="Choose your TEC membership tier and unlock exclusive benefits" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
              TEC Membership Tiers
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the membership level that matches your ambitions. 
              Each tier unlocks exclusive benefits and priority access to elite opportunities.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                  tier.popular ? 'ring-2 ring-[#00ff9d]' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-[#00ff9d] text-gray-900 px-4 py-1 text-sm font-bold">
                    POPULAR
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-br ${tier.color} p-6 text-center`}>
                  <div className="text-5xl mb-3">{tier.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold">{tier.price}</div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-[#00ff9d] mt-1">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      tier.priceValue === 0
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 hover:shadow-lg'
                    }`}
                  >
                    {tier.priceValue === 0 ? 'Get Started' : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Comparison */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Detailed Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 px-4">Feature</th>
                    <th className="py-4 px-4 text-center">🥉 Bronze</th>
                    <th className="py-4 px-4 text-center">🥈 Silver</th>
                    <th className="py-4 px-4 text-center">🥇 Gold</th>
                    <th className="py-4 px-4 text-center">💎 Platinum</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4">Response Time</td>
                    <td className="py-4 px-4 text-center text-gray-400">48h</td>
                    <td className="py-4 px-4 text-center text-gray-400">24h</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">2h</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">Immediate</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4">Brokerage Discount</td>
                    <td className="py-4 px-4 text-center text-gray-400">0%</td>
                    <td className="py-4 px-4 text-center text-gray-400">5%</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">10%</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">15%</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4">Account Manager</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">✓</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">✓</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4">Exclusive Events</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">✓</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-4">Strategy Sessions</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center">❌</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">Quarterly</td>
                    <td className="py-4 px-4 text-center text-[#00ff9d]">Monthly</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-bold mb-2">Can I upgrade or downgrade my membership?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, you can change your membership tier at any time. Upgrades take effect immediately, 
                  while downgrades take effect at the end of your current billing cycle.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400 text-sm">
                  We accept Pi Network cryptocurrency for all membership payments. 
                  Payments are processed securely through Pi's blockchain infrastructure.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-bold mb-2">Is there a contract or commitment?</h3>
                <p className="text-gray-400 text-sm">
                  No long-term contracts required. All memberships are month-to-month and 
                  can be cancelled at any time with no penalties.
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="font-bold mb-2">What happens if I cancel?</h3>
                <p className="text-gray-400 text-sm">
                  You'll retain access to your membership benefits until the end of your current billing period. 
                  After that, you'll revert to Bronze (free) tier access.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Experience?</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of elite members accessing exclusive opportunities
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
