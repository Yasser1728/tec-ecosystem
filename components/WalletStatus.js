/**
 * Wallet Status Component
 * Displays wallet connection status and payment eligibility info after login.
 * 
 * Shows:
 * - Wallet connection status
 * - Network environment
 * - Payment readiness indicator
 * 
 * UI-ONLY — Reads state only. Does NOT modify wallet or payment logic.
 */

import { AUTH_STATES, PAYMENT_STATUS } from "../hooks/usePiAuth";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function WalletStatus({
  authState,
  user,
  paymentStatus,
  language = "en",
}) {
  // Only show when logged in
  if (authState !== AUTH_STATES.LOGGED_IN || !user) {
    return null;
  }

  const hasWallet = !!user.walletAddress;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-tec-green to-tec-blue rounded-full flex items-center justify-center shrink-0">
          <span className="text-tec-dark font-bold text-sm">
            {user.username ? user.username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            @{user.username || "unknown"}
          </p>
          {user.piId && (
            <p className="text-xs text-gray-500 truncate">
              ID: {user.piId.slice(0, 12)}...
            </p>
          )}
        </div>
      </div>

      {/* Wallet */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {language === "ar" ? "المحفظة" : "Wallet"}
        </span>
        {hasWallet ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {language === "ar" ? "متصلة" : "Connected"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            {language === "ar" ? "غير متصلة" : "Not Connected"}
          </span>
        )}
      </div>

      {/* Wallet address */}
      {hasWallet && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {language === "ar" ? "العنوان" : "Address"}
          </span>
          <span className="text-xs text-gray-300 font-mono">
            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
          </span>
        </div>
      )}

      {/* Network */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {language === "ar" ? "الشبكة" : "Network"}
        </span>
        <PaymentStatusBadge
          status={paymentStatus}
          language={language}
          compact
        />
      </div>

      {/* Wallet missing warning */}
      {!hasWallet && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-2.5 mt-1">
          <p className="text-xs text-yellow-300">
            ⚠️ {language === "ar"
              ? "يرجى ربط محفظتك في تطبيق Pi للوصول إلى المدفوعات"
              : "Please connect your wallet in Pi app to access payments"}
          </p>
        </div>
      )}
    </div>
  );
}
