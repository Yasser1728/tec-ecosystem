import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getDomainInfo } from "../lib/domainRedirect";
import { domainMapping } from "../lib/domainMapping";

export default function TestDomain() {
  const [domainInfo, setDomainInfo] = useState(null);
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    // Get current hostname
    const host = window.location.hostname;
    setHostname(host);

    // Get domain info
    const info = getDomainInfo(host);
    setDomainInfo(info);
  }, []);

  return (
    <>
      <Head>
        <title>Domain Test - TEC Ecosystem</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] bg-clip-text text-transparent">
            Domain Detection Test
          </h1>

          {/* Current Domain Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Current Domain</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-32">Hostname:</span>
                <span className="font-mono text-[#00ff9d]">
                  {hostname || "Loading..."}
                </span>
              </div>

              {domainInfo ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Domain:</span>
                    <span className="font-mono text-[#00ff9d]">
                      {domainInfo.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Business Unit:</span>
                    <span className="font-semibold">{domainInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Route:</span>
                    <span className="font-mono">{domainInfo.route}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Category:</span>
                    <span>{domainInfo.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Priority:</span>
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        domainInfo.priority === "Tier 1"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : domainInfo.priority === "Tier 2"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {domainInfo.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 w-32">Status:</span>
                    <span className="text-green-400">
                      ✓ {domainInfo.status}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  {hostname.includes("localhost") ||
                  hostname.includes("vercel") ? (
                    <p>⚠️ Not a .pi domain (Development/Production URL)</p>
                  ) : (
                    <p>❌ Domain not recognized</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* All Configured Domains */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              All Configured Domains ({Object.keys(domainMapping).length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(domainMapping).map(([domain, config]) => (
                <div
                  key={domain}
                  className={`p-4 rounded-lg border ${
                    hostname === domain
                      ? "bg-[#00ff9d]/10 border-[#00ff9d]"
                      : "bg-gray-900 border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-[#00ff9d]">
                      {domain}
                    </span>
                    {hostname === domain && (
                      <span className="text-xs bg-[#00ff9d] text-gray-900 px-2 py-1 rounded">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {config.name} → {config.route}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {config.category} • {config.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-bold text-white mb-2">Local Testing:</h3>
                <p>
                  Visit:{" "}
                  <code className="bg-gray-900 px-2 py-1 rounded">
                    http://localhost:3000/test-domain
                  </code>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Will show development URL (not .pi domain)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">
                  Production Testing:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Deploy to Vercel</li>
                  <li>Configure domains in Pi Developer Portal</li>
                  <li>Open Pi Browser</li>
                  <li>
                    Visit:{" "}
                    <code className="bg-gray-900 px-2 py-1 rounded">
                      life.pi/test-domain
                    </code>
                  </li>
                  <li>Should show "life.pi" as current domain</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">
                  Expected Behavior:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Each .pi domain shows its own info</li>
                  <li>Domain detection works automatically</li>
                  <li>Routing happens in middleware</li>
                  <li>User sees correct business unit</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
