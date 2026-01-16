import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { logger } from '../../lib/utils/logger.js';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { callbackUrl } = router.query;

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl || "/dashboard");
    }
  }, [status, router, callbackUrl]);

  const handlePiSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not loaded. Please open in Pi Browser.");
      }

      // Authenticate with Pi Network
      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          console.log("Incomplete payment:", payment);
        },
      );

      console.log("Pi Auth Result:", authResult);

      // Sign in with NextAuth
      const result = await signIn("pi-network", {
        piId: authResult.user.uid,
        username: authResult.user.username,
        accessToken: authResult.accessToken,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl || "/dashboard");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "Failed to sign in with Pi Network");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff9d]"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent cursor-pointer">
                TEC Ecosystem
              </h1>
            </Link>
            <p className="text-gray-400 mt-2">Sign in to access your account</p>
          </div>

          {/* Sign In Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Welcome Back
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Pi Network Sign In */}
            <button
              onClick={handlePiSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>🥧</span>
                  <span>Sign in with Pi Network</span>
                </>
              )}
            </button>

            {/* Info */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Don't have Pi Network?{" "}
                <a
                  href="https://minepi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00ff9d] hover:underline"
                >
                  Get started here
                </a>
              </p>
            </div>

            {/* Callback URL Info */}
            {callbackUrl && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <p className="text-blue-400 text-xs text-center">
                  You'll be redirected after signing in
                </p>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
