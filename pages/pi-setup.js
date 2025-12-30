import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PiSetup() {
  return (
    <>
      <Head>
        <title>Pi Network Setup Guide - TEC Ecosystem</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
            🌐 Pi Network Integration Guide
          </h1>

          {/* Quick Start */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              ⚡ Quick Start
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-bold mb-1">Register App</h3>
                  <p className="text-gray-400 text-sm">
                    Visit{" "}
                    <a
                      href="https://developers.minepi.com"
                      target="_blank"
                      rel="noopener"
                      className="text-[#00c6ff] hover:underline"
                    >
                      Pi Developer Portal
                    </a>{" "}
                    and create new app
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-bold mb-1">Get App ID</h3>
                  <p className="text-gray-400 text-sm">
                    Copy your App ID from the dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-bold mb-1">Add to Vercel</h3>
                  <p className="text-gray-400 text-sm">
                    Add NEXT_PUBLIC_PI_APP_ID in Vercel environment variables
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h3 className="font-bold mb-1">Enable Sandbox</h3>
                  <p className="text-gray-400 text-sm">
                    Set NEXT_PUBLIC_PI_SANDBOX=true for testing
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Environment Variables */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              🔧 Environment Variables
            </h2>
            <div className="bg-gray-900 rounded p-4 font-mono text-sm">
              <div className="text-gray-500"># Required</div>
              <div className="text-[#00ff9d]">
                NEXT_PUBLIC_PI_APP_ID<span className="text-white">=</span>
                <span className="text-yellow-400">
                  tec-titan-elite-commerce-04d84accdca2487c
                </span>
              </div>
              <div className="text-[#00ff9d]">
                NEXT_PUBLIC_PI_SANDBOX<span className="text-white">=</span>
                <span className="text-yellow-400">true</span>
              </div>
              <div className="mt-3 text-gray-500"># Optional (for backend)</div>
              <div className="text-[#00ff9d]">
                PI_API_KEY<span className="text-white">=</span>
                <span className="text-yellow-400">your_api_key_here</span>
              </div>
            </div>
          </section>

          {/* App Configuration */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              📱 App Configuration
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">App Name:</span>
                <span className="font-mono">Tec (Titan Elite Commerce)</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">App URL:</span>
                <span className="font-mono text-[#00c6ff]">
                  https://tec-ecosystem.vercel.app
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">App ID:</span>
                <span className="font-mono text-xs text-[#00c6ff]">
                  tec-titan-elite-commerce-04d84accdca2487c
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Sandbox Mode:</span>
                <span className="text-[#00ff9d]">✅ Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">SDK Version:</span>
                <span className="font-mono">v2.0</span>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              🧪 Testing
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Sandbox Mode (Any Browser)</h3>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>No real Pi required</li>
                  <li>Mock authentication</li>
                  <li>Simulated payments</li>
                  <li>Perfect for development</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Production Mode (Pi Browser)</h3>
                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                  <li>Real Pi Network authentication</li>
                  <li>Actual Pi payments</li>
                  <li>Blockchain verification</li>
                  <li>Use small amounts for testing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              🔍 Troubleshooting
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-bold text-red-400 mb-1">
                  ❌ "Pi SDK not loaded"
                </h3>
                <p className="text-gray-400">
                  Check browser console, refresh page, or enable sandbox mode
                </p>
              </div>
              <div>
                <h3 className="font-bold text-red-400 mb-1">
                  ❌ "Invalid App ID"
                </h3>
                <p className="text-gray-400">
                  Verify App ID in Vercel environment variables and redeploy
                </p>
              </div>
              <div>
                <h3 className="font-bold text-red-400 mb-1">
                  ❌ "Payment not working"
                </h3>
                <p className="text-gray-400">
                  Ensure sandbox mode is enabled and check payment callbacks
                </p>
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#00ff9d] mb-4">
              🔗 Useful Links
            </h2>
            <div className="space-y-2 text-sm">
              <a
                href="https://developers.minepi.com"
                target="_blank"
                rel="noopener"
                className="block text-[#00c6ff] hover:underline"
              >
                → Pi Developer Portal
              </a>
              <a
                href="https://developers.minepi.com/doc/javascript-sdk"
                target="_blank"
                rel="noopener"
                className="block text-[#00c6ff] hover:underline"
              >
                → Pi SDK Documentation
              </a>
              <a
                href="https://minepi.com"
                target="_blank"
                rel="noopener"
                className="block text-[#00c6ff] hover:underline"
              >
                → Pi Network
              </a>
              <Link href="/" className="block text-[#00c6ff] hover:underline">
                → Back to Homepage
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Pi Integration Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
