import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function PiTest() {
  const [logs, setLogs] = useState([]);
  const [piStatus, setPiStatus] = useState("Checking...");

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, type }]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    addLog("Page loaded");

    // Check Pi SDK every second
    const interval = setInterval(() => {
      if (window.Pi) {
        setPiStatus("✅ Pi SDK Loaded");
        addLog("✅ Pi SDK detected!", "success");
        clearInterval(interval);
      } else {
        setPiStatus("⏳ Waiting for Pi SDK...");
      }
    }, 1000);

    // Timeout after 15 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (!window.Pi) {
        setPiStatus("❌ Pi SDK Failed to Load");
        addLog("❌ Pi SDK not loaded after 15 seconds", "error");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const testPiSDK = () => {
    addLog("🧪 Testing Pi SDK...");

    if (!window.Pi) {
      addLog("❌ window.Pi is undefined", "error");
      alert("Pi SDK not loaded!");
      return;
    }

    addLog("✅ window.Pi exists", "success");
    addLog(`Pi SDK methods: ${Object.keys(window.Pi).join(", ")}`, "info");

    if (window.piConfig) {
      addLog(`App ID: ${window.piConfig.appId}`, "info");
      addLog(`Sandbox: ${window.piConfig.sandbox}`, "info");
    }
  };

  const testAuth = async () => {
    addLog("🔐 Starting authentication...");

    if (!window.Pi) {
      addLog("❌ Pi SDK not loaded", "error");
      alert("Pi SDK not loaded! Refresh the page.");
      return;
    }

    try {
      addLog("Calling Pi.authenticate()...");

      const result = await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          addLog(`⚠️ Incomplete payment: ${payment.identifier}`);
        },
      );

      addLog("✅ Authentication successful!", "success");
      addLog(`User: ${result.user.username}`, "success");
      addLog(`UID: ${result.user.uid}`, "info");
    } catch (error) {
      addLog(`❌ Authentication failed: ${error.message}`, "error");
      console.error("Auth error:", error);
    }
  };

  const testPayment = async () => {
    addLog("💰 Starting payment...");

    if (!window.Pi) {
      addLog("❌ Pi SDK not loaded", "error");
      return;
    }

    try {
      // First authenticate
      addLog("Step 1: Authenticating...");
      const authResult = await window.Pi.authenticate(
        ["username", "payments"],
        () => {},
      );
      addLog(`✅ Authenticated as ${authResult.user.username}`, "success");

      // Then create payment
      addLog("Step 2: Creating payment...");
      const payment = await window.Pi.createPayment(
        {
          amount: 1,
          memo: "Test Payment",
          metadata: { test: true },
        },
        {
          onReadyForServerApproval: (paymentId) => {
            addLog(`✅ Payment approved: ${paymentId}`, "success");
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            addLog(`✅ Payment completed: ${txid}`, "success");
          },
          onCancel: (paymentId) => {
            addLog(`❌ Payment cancelled: ${paymentId}`, "error");
          },
          onError: (error) => {
            addLog(`❌ Payment error: ${error.message}`, "error");
          },
        },
      );

      addLog(`Payment created: ${payment.identifier}`, "success");
    } catch (error) {
      addLog(`❌ Payment failed: ${error.message}`, "error");
      console.error("Payment error:", error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <>
      <Head>
        <title>Pi SDK Test Page - TEC</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#00ff9d]">
            🧪 Pi SDK Test Page
          </h1>
          <p className="text-gray-400 mb-8">
            Debug and test Pi Network integration
          </p>

          {/* Status */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Pi SDK Status</h2>
            <div className="text-2xl font-mono">{piStatus}</div>
          </div>

          {/* Test Buttons */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Test Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testPiSDK}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                🧪 Test Pi SDK
              </button>
              <button
                onClick={testAuth}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                🔐 Test Authentication
              </button>
              <button
                onClick={testPayment}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                💰 Test Payment
              </button>
              <button
                onClick={clearLogs}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                🗑️ Clear Logs
              </button>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-800 border border-[#00ff9d]/30 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Console Logs</h2>
            <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      log.type === "error"
                        ? "text-red-400"
                        : log.type === "success"
                          ? "text-green-400"
                          : "text-gray-300"
                    }`}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#00ff9d] hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
