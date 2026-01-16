import { useState } from "react";
import { logger } from '../lib/utils/logger.js';

export default function ConsultationForm({ service = "General", onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: "",
    email: "",
    phone: "",

    // Step 2: Qualification
    budget: "",
    timeline: "",
    purpose: "",

    // Step 3: Additional
    message: "",
    preferredContact: "email",
  });

  const [tier, setTier] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTier = () => {
    let score = 0;

    // Budget scoring
    if (formData.budget === "1m+") score += 40;
    else if (formData.budget === "500k-1m") score += 30;
    else if (formData.budget === "100k-500k") score += 20;
    else score += 10;

    // Timeline scoring
    if (formData.timeline === "1month") score += 30;
    else if (formData.timeline === "3-6months") score += 20;
    else score += 10;

    // Purpose scoring
    if (formData.purpose === "investment") score += 30;
    else if (formData.purpose === "business") score += 20;
    else score += 10;

    // Determine tier
    if (score >= 80) return "Platinum";
    if (score >= 60) return "Gold";
    if (score >= 40) return "Silver";
    return "Bronze";
  };

  const handleNext = () => {
    if (step === 2) {
      const calculatedTier = calculateTier();
      setTier(calculatedTier);
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Note: Send to backend API endpoint
    logger.info("Consultation Request:", {
      ...formData,
      service,
      tier,
      submittedAt: new Date().toISOString(),
    });

    alert(
      `Thank you! Your ${tier} tier consultation request has been submitted. We'll contact you within ${tier === "Platinum" ? "2 hours" : tier === "Gold" ? "24 hours" : "48 hours"}.`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#00ff9d]">
              Request Consultation
            </h3>
            <p className="text-gray-400 text-sm mt-1">{service} Service</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div
            className={`flex items-center ${step >= 1 ? "text-[#00ff9d]" : "text-gray-600"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#00ff9d] text-gray-900" : "bg-gray-700"} font-bold`}
            >
              1
            </div>
            <span className="ml-2 text-sm">Contact</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-700">
            <div
              className={`h-full ${step >= 2 ? "bg-[#00ff9d]" : "bg-gray-700"} transition-all`}
              style={{ width: step >= 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <div
            className={`flex items-center ${step >= 2 ? "text-[#00ff9d]" : "text-gray-600"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#00ff9d] text-gray-900" : "bg-gray-700"} font-bold`}
            >
              2
            </div>
            <span className="ml-2 text-sm">Details</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-700">
            <div
              className={`h-full ${step >= 3 ? "bg-[#00ff9d]" : "bg-gray-700"} transition-all`}
              style={{ width: step >= 3 ? "100%" : "0%" }}
            ></div>
          </div>
          <div
            className={`flex items-center ${step >= 3 ? "text-[#00ff9d]" : "text-gray-600"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#00ff9d] text-gray-900" : "bg-gray-700"} font-bold`}
            >
              3
            </div>
            <span className="ml-2 text-sm">Confirm</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.name || !formData.email}
                className="w-full bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Qualification */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Investment Budget (Pi) *
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="<100k">Less than 100,000 Pi</option>
                  <option value="100k-500k">100,000 - 500,000 Pi</option>
                  <option value="500k-1m">500,000 - 1M Pi</option>
                  <option value="1m+">More than 1M Pi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Timeline *
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                >
                  <option value="">Select timeline</option>
                  <option value="1month">Within 1 month</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="1year">Within 1 year</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Purpose *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                >
                  <option value="">Select purpose</option>
                  <option value="investment">Investment</option>
                  <option value="business">Business Use</option>
                  <option value="personal">Personal Use</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    !formData.budget || !formData.timeline || !formData.purpose
                  }
                  className="flex-1 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Tier Badge */}
              <div
                className={`text-center p-6 rounded-lg ${
                  tier === "Platinum"
                    ? "bg-gradient-to-r from-purple-900 to-pink-900"
                    : tier === "Gold"
                      ? "bg-gradient-to-r from-yellow-900 to-orange-900"
                      : tier === "Silver"
                        ? "bg-gradient-to-r from-gray-700 to-gray-600"
                        : "bg-gradient-to-r from-orange-900 to-red-900"
                }`}
              >
                <div className="text-4xl mb-2">
                  {tier === "Platinum"
                    ? "💎"
                    : tier === "Gold"
                      ? "🥇"
                      : tier === "Silver"
                        ? "🥈"
                        : "🥉"}
                </div>
                <h4 className="text-2xl font-bold mb-2">{tier} Tier</h4>
                <p className="text-sm text-gray-300">
                  Response time:{" "}
                  {tier === "Platinum"
                    ? "2 hours"
                    : tier === "Gold"
                      ? "24 hours"
                      : "48 hours"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:border-[#00ff9d] focus:outline-none"
                  placeholder="Tell us more about your requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === "email"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === "phone"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Phone</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
