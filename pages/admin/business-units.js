import { withAuth } from "../../lib/withAuth";
import { USER_TIERS } from "../../lib/roles";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function AdminBusinessUnits({ session }) {
  return (
    <>
      <Head>
        <title>Business Units Management - Admin - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Link href="/admin" className="text-gray-400 hover:text-[#00ff9d]">
              Admin Dashboard
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">Business Units</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Business Units Management
            </h1>
            <p className="text-gray-400">Manage all 21 business units</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <p className="text-gray-400 text-center">
              Business units management interface coming soon...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(AdminBusinessUnits, {
  requiredTier: USER_TIERS.ADMIN,
});
