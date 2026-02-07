/**
 * Payment Button Component
 * Renders the correct payment UI based on the payment state matrix.
 * 
 * STATE MATRIX:
 * - Mainnet + Auth + Wallet → Real Payment Button
 * - Testnet → Demo Payment Button
 * - Pi SDK Missing → Pi Browser Required message
 * - Not authenticated → Login prompt
 * 
 * UI-ONLY — Calls existing payment triggers. Does NOT create new payment logic.
 */

import { AUTH_STATES, PAYMENT_STATUS } from "../hooks/usePiAuth";

export default function PaymentButton({
  authState,
  paymentStatus,
  onPayment,
  language = "en",
  className = "",
}) {
  // STATE: Pi SDK Missing
  if (authState === AUTH_STATES.SDK_MISSING) {
    return (
      <div className={`bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 text-center ${className}`}>
        <p className="text-yellow-300 text-sm font-medium">
          📱 {language === "ar"
            ? "يرجى فتح التطبيق داخل متصفح Pi"
            : "Please open this app inside Pi Browser"}
        </p>
      </div>
    );
  }

  // STATE: Not authenticated
  if (authState !== AUTH_STATES.LOGGED_IN) {
    return (
      <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center ${className}`}>
        <p className="text-gray-400 text-sm">
          🔒 {language === "ar"
            ? "سجّل دخولك لعرض خيارات الدفع"
            : "Sign in to view payment options"}
        </p>
      </div>
    );
  }

  // STATE: Wallet Missing
  if (paymentStatus === PAYMENT_STATUS.WALLET_MISSING) {
    return (
      <div className={`bg-gray-800/50 border border-gray-600/50 rounded-xl p-4 text-center ${className}`}>
        <p className="text-gray-300 text-sm mb-2">
          ⚪ {language === "ar"
            ? "المحفظة غير متصلة"
            : "Wallet not connected"}
        </p>
        <p className="text-gray-500 text-xs">
          {language === "ar"
            ? "يرجى ربط محفظتك من خلال متصفح Pi"
            : "Please connect your wallet through Pi Browser"}
        </p>
      </div>
    );
  }

  // STATE: Connection Failed
  if (paymentStatus === PAYMENT_STATUS.CONNECTION_FAILED) {
    return (
      <div className={`bg-red-900/10 border border-red-600/30 rounded-xl p-4 text-center ${className}`}>
        <p className="text-red-300 text-sm">
          {language === "ar"
            ? "الدفع الحقيقي بـ Pi غير متاح حالياً. يرجى تجربة الدفع التجريبي أو اختبار SDK."
            : "Real Pi payment is currently unavailable. Please try demo payment or SDK testing."}
        </p>
      </div>
    );
  }

  // STATE: Test Mode
  if (paymentStatus === PAYMENT_STATUS.TEST_MODE) {
    return (
      <button
        onClick={onPayment}
        className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 ${className}`}
      >
        🧪 {language === "ar" ? "دفع تجريبي (وضع الاختبار)" : "Demo Payment (Test Mode)"}
      </button>
    );
  }

  // STATE: Mainnet Ready — Real Payment Button
  return (
    <button
      onClick={onPayment}
      className={`w-full bg-gradient-to-r from-tec-green to-tec-blue text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-tec-green/30 transition-all duration-300 ring-2 ring-tec-green/30 hover:ring-tec-green/60 ${className}`}
    >
      💰 {language === "ar" ? "الدفع بـ Pi (الشبكة الرئيسية)" : "Pay with Pi (Mainnet)"}
    </button>
  );
}
