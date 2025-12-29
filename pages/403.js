import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Forbidden() {
  return (
    <>
      <Head>
        <title>403 - Access Forbidden - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-red-500/10 rounded-full mb-6">
                <span className="text-7xl">🚫</span>
              </div>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                403
              </h1>
              <h2 className="text-3xl font-bold mb-4">Access Forbidden</h2>
              <p className="text-xl text-gray-400 mb-8">
                You don't have permission to access this page.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-gray-800 border border-red-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold mb-3">Why am I seeing this?</h3>
              <ul className="text-left text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>This page requires a higher tier subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>You need admin privileges to access this area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Your account may not have the required permissions</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Go to Home
              </Link>
              <Link
                href="/upgrade"
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Upgrade Plan
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-8">
              <p className="text-gray-400 text-sm">
                Need help?{' '}
                <Link href="/support" className="text-[#00ff9d] hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
