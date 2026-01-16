import { useState, useEffect } from "react";
import { piAuth } from "../lib/pi-auth";
import { logger } from '../lib/utils/logger.js';

export default function PiAuthButton({ onAuthSuccess, onAuthError }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [piAvailable, setPiAvailable] = useState(false);

  useEffect(() => {
    // Check if Pi SDK is available
    const checkPiSDK = () => {
      if (typeof window !== "undefined" && window.Pi) {
        setPiAvailable(true);
      }
    };

    checkPiSDK();

    // Retry check after a delay if not immediately available
    const timer = setTimeout(checkPiSDK, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async () => {
    setLoading(true);

    try {
      const result = await piAuth.authenticate();

      if (result.success) {
        setUser(result.user);
        if (onAuthSuccess) {
          onAuthSuccess(result.user);
        }
      } else {
        if (onAuthError) {
          onAuthError(result.error);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (onAuthError) {
        onAuthError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await piAuth.signOut();
    setUser(null);
  };

  if (!piAvailable) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 text-yellow-200">
        <p className="text-sm">
          ⚠️ Pi Browser required. Please open this app in the Pi Browser to
          authenticate.
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00ff9d] to-[#00c6ff] rounded-full flex items-center justify-center">
            <span className="text-[#0a0e2b] font-bold text-sm">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">@{user.username}</p>
            <p className="text-xs text-gray-400">
              Tier: {user.tier || "STANDARD"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-[#0a0e2b] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Authenticating...
        </span>
      ) : (
        "Connect with Pi"
      )}
    </button>
  );
}
