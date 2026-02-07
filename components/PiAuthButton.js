import { useState, useEffect } from "react";
import { piAuth } from "../lib/pi-auth.js";

/**
 * PiAuthButton — Handles all 4 authentication UI states:
 * STATE A: Logged Out → Show Login Button
 * STATE B: Loading → Show "Connecting to Pi Network..."
 * STATE C: Logged In → Show Username, Wallet, Network, Logout
 * STATE D: Pi SDK Missing → Show "Open inside Pi Browser" message
 * 
 * UI-ONLY — Calls existing piAuth triggers. Does NOT modify auth logic.
 */
export default function PiAuthButton({
  onAuthSuccess,
  onAuthError,
  onAuthLoading,
  onSignOut,
  compact = false,
  language = "en",
}) {
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
    if (onAuthLoading) onAuthLoading();

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
    if (onSignOut) onSignOut();
  };

  // STATE D — Pi SDK Missing
  if (!piAvailable) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 text-yellow-200">
        <p className="text-sm font-medium">
          📱 {language === "ar"
            ? "يرجى فتح هذا التطبيق في متصفح Pi للمصادقة"
            : "Open inside Pi Browser to authenticate"}
        </p>
        <p className="text-xs text-yellow-400/70 mt-1">
          {language === "ar"
            ? "Pi SDK غير متوفر في هذا المتصفح"
            : "Pi SDK is not available in this browser"}
        </p>
      </div>
    );
  }

  // STATE C — Logged In
  if (user) {
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-tec-green to-tec-blue rounded-full flex items-center justify-center">
            <span className="text-tec-dark font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-white hidden sm:inline">
            @{user.username}
          </span>
          <button
            onClick={handleSignOut}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
            title={language === "ar" ? "تسجيل الخروج" : "Sign Out"}
          >
            ✕
          </button>
        </div>
      );
    }

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
              {user.tier || "STANDARD"}
              {user.walletAddress ? " • 💰" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {language === "ar" ? "خروج" : "Sign Out"}
        </button>
      </div>
    );
  }

  // STATE B — Loading
  if (loading) {
    return (
      <button
        disabled
        className={`bg-gradient-to-r from-[#00ff9d]/50 to-[#00c6ff]/50 text-[#0a0e2b] font-semibold rounded-xl opacity-70 cursor-not-allowed ${
          compact ? "px-4 py-2 text-sm" : "px-6 py-3"
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
          {language === "ar" ? "جاري الاتصال بشبكة Pi..." : "Connecting to Pi Network..."}
        </span>
      </button>
    );
  }

  // STATE A — Logged Out
  return (
    <button
      onClick={handleAuth}
      className={`bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-[#0a0e2b] font-semibold rounded-xl hover:shadow-lg hover:shadow-tec-green/20 transition-all duration-300 ${
        compact ? "px-4 py-2 text-sm" : "px-6 py-3"
      }`}
    >
      {language === "ar" ? "🔗 الاتصال بـ Pi" : "🔗 Connect with Pi"}
    </button>
  );
}
