import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

/**
 * Login Skeleton Page
 * Placeholder authentication interface for TEC ecosystem
 */
export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Mock authentication - replace with real authentication service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.username && formData.password) {
        setMessage("✅ Login successful! Redirecting to dashboard...");
        // Use Next.js router for client-side navigation
        setTimeout(() => {
          router.push("/tec");
        }, 1500);
      } else {
        setMessage("❌ Please fill in all fields");
      }
    } catch (error) {
      setMessage("❌ Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | TEC Portal</title>
        <meta
          name="description"
          content="Login to your TEC ecosystem account"
        />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-gray-800 rounded-lg border border-[#00ff9d]/20 p-8 shadow-2xl">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] mb-2">
                TEC Portal
              </h1>
              <p className="text-gray-400">Sign in to access the ecosystem</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-300 mb-2 font-semibold"
                >
                  Username / اسم المستخدم
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-[#00ff9d] focus:outline-none transition-colors"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-300 mb-2 font-semibold"
                >
                  Password / كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-[#00ff9d] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-600 bg-gray-700 text-[#00ff9d] focus:ring-[#00ff9d]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-[#00c6ff] hover:text-[#00ff9d] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-center ${
                    message.includes("✅")
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            {/* Alternative Options */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 mb-4">Or continue with</p>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors border border-gray-600">
                  🥧 Pi Network
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors border border-gray-600">
                  👤 Guest Access
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button className="text-[#00c6ff] hover:text-[#00ff9d] font-semibold transition-colors">
                  Sign up now
                </button>
              </p>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-6 text-center">
            <Link
              href="/tec"
              className="text-[#00c6ff] hover:text-[#00ff9d] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 text-center">
              ℹ️ This is a skeleton implementation. Full authentication will be
              integrated with Pi Network and NextAuth.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
