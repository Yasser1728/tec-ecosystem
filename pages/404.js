import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-500/10 rounded-full mb-6">
                <span className="text-7xl">🔍</span>
              </div>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
              <p className="text-xl text-gray-400 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Popular Pages</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link
                  href="/ecosystem"
                  className="bg-gray-900 hover:bg-gray-700 p-4 rounded-lg transition-all text-left"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <p className="font-semibold">Ecosystem</p>
                  <p className="text-xs text-gray-400">View all business units</p>
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-gray-900 hover:bg-gray-700 p-4 rounded-lg transition-all text-left"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-semibold">Dashboard</p>
                  <p className="text-xs text-gray-400">Your account</p>
                </Link>
                <Link
                  href="/fundx"
                  className="bg-gray-900 hover:bg-gray-700 p-4 rounded-lg transition-all text-left"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <p className="font-semibold">FundX</p>
                  <p className="text-xs text-gray-400">Investment strategies</p>
                </Link>
                <Link
                  href="/explorer"
                  className="bg-gray-900 hover:bg-gray-700 p-4 rounded-lg transition-all text-left"
                >
                  <div className="text-2xl mb-2">🔭</div>
                  <p className="font-semibold">Explorer</p>
                  <p className="text-xs text-gray-400">Discovery platform</p>
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Go to Home
              </Link>
              <button
                onClick={() => router.back()}
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
