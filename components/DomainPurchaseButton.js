import { useState } from "react";
import { piPayments, DOMAIN_PRICES } from "../lib/pi-payments.js";
import { piAuth } from "../lib/pi-auth.js";

export default function DomainPurchaseButton({
  domain,
  tier = "STANDARD",
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const price = DOMAIN_PRICES[domain] || DOMAIN_PRICES.default;
  const tierMultiplier = tier === "PREMIUM" ? 1.5 : tier === "VIP" ? 2 : 1;
  const finalPrice = price * tierMultiplier;

  const handlePurchase = async () => {
    if (!piAuth.isAuthenticated()) {
      if (onError) {
        onError("Please authenticate with Pi Network first");
      }
      return;
    }

    setLoading(true);

    try {
      const result = await piPayments.createDomainPurchase({ domain, tier });

      if (result.success) {
        setPurchased(true);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (purchased) {
    return (
      <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-green-200">
        <p className="text-sm">✅ Domain purchased successfully!</p>
      </div>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full px-6 py-3 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-[#0a0e2b] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
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
          Processing...
        </span>
      ) : (
        `Purchase ${domain.toUpperCase()} - ${finalPrice} π`
      )}
    </button>
  );
}
