import { withAuth } from '../../lib/withAuth';
import { USER_TIERS } from '../../lib/roles';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Profile({ session }) {
  const user = session?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    language: 'en',
  });

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut({ callbackUrl: '/' });
    }
  };

  return (
    <>
      <Head>
        <title>My Profile - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-[#00ff9d]">
              Dashboard
            </Link>
            <span className="text-gray-600 mx-2">/</span>
            <span className="text-white">Profile</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your account settings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Account Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[#00ff9d] hover:underline text-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#00ff9d] focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg">{user?.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#00ff9d] focus:outline-none"
                      />
                    ) : (
                      <p className="text-lg">{user?.email || 'Not set'}</p>
                    )}
                  </div>

                  {/* Pi ID */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Pi Network ID
                    </label>
                    <p className="text-lg font-mono text-gray-300">{user?.piId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      This cannot be changed
                    </p>
                  </div>

                  {/* Account Tier */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Tier
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-[#00ff9d] font-semibold">
                        {user?.tier}
                      </span>
                      {user?.tier === USER_TIERS.STANDARD && (
                        <Link
                          href="/upgrade"
                          className="text-sm text-[#00ff9d] hover:underline"
                        >
                          Upgrade →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Account Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.status === 'ACTIVE'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user?.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 mt-6">
                <h2 className="text-2xl font-bold text-red-400 mb-4">
                  Danger Zone
                </h2>
                <p className="text-gray-400 mb-4">
                  Once you sign out, you'll need to authenticate with Pi Network again.
                </p>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white font-semibold">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Transactions</span>
                    <span className="text-white font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Subscriptions</span>
                    <span className="text-white font-semibold">1</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/transactions"
                    className="block text-gray-400 hover:text-[#00ff9d] transition-colors"
                  >
                    → View Transactions
                  </Link>
                  <Link
                    href="/upgrade"
                    className="block text-gray-400 hover:text-[#00ff9d] transition-colors"
                  >
                    → Upgrade Plan
                  </Link>
                  <Link
                    href="/ecosystem"
                    className="block text-gray-400 hover:text-[#00ff9d] transition-colors"
                  >
                    → Explore Ecosystem
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Our support team is here to help you
                </p>
                <Link
                  href="/support"
                  className="block text-center bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-all"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default withAuth(Profile, {
  requiredTier: USER_TIERS.STANDARD,
});
