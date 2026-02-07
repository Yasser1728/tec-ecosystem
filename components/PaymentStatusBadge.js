/**
 * Payment Status Badge Component
 * Displays dynamic status badge based on Pi SDK + environment state.
 * 
 * 🟢 Mainnet Ready
 * 🟡 Test Mode
 * 🔴 Pi Connection Failed
 * ⚪ Wallet Missing
 * 
 * UI-ONLY — Does NOT modify payment logic or Pi SDK.
 */

import { PAYMENT_STATUS } from "../hooks/usePiAuth";

const statusConfig = {
  [PAYMENT_STATUS.MAINNET_READY]: {
    color: "bg-green-500",
    borderColor: "border-green-500/50",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
    label: "Mainnet Ready",
    labelAr: "الشبكة الرئيسية جاهزة",
    icon: "🟢",
  },
  [PAYMENT_STATUS.TEST_MODE]: {
    color: "bg-yellow-500",
    borderColor: "border-yellow-500/50",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
    label: "Test Mode",
    labelAr: "وضع الاختبار",
    icon: "🟡",
  },
  [PAYMENT_STATUS.CONNECTION_FAILED]: {
    color: "bg-red-500",
    borderColor: "border-red-500/50",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    label: "Pi Connection Failed",
    labelAr: "فشل اتصال Pi",
    icon: "🔴",
  },
  [PAYMENT_STATUS.WALLET_MISSING]: {
    color: "bg-gray-400",
    borderColor: "border-gray-500/50",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-400",
    label: "Wallet Missing",
    labelAr: "المحفظة غير متصلة",
    icon: "⚪",
  },
};

export default function PaymentStatusBadge({ status, language = "en", compact = false }) {
  const config = statusConfig[status] || statusConfig[PAYMENT_STATUS.CONNECTION_FAILED];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.borderColor} border ${config.textColor}`}
        title={language === "ar" ? config.labelAr : config.label}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
        {language === "ar" ? config.labelAr : config.label}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bgColor} ${config.borderColor} border ${config.textColor}`}
    >
      <span>{config.icon}</span>
      <span>{language === "ar" ? config.labelAr : config.label}</span>
    </div>
  );
}
