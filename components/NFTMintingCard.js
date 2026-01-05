import { useState } from "react";
import Image from "next/image";
import {
  nftMinting,
  CERTIFICATE_TYPES,
  CERTIFICATE_METADATA,
} from "../lib/nft-minting";
import { piAuth } from "../lib/pi-auth";

export default function NFTMintingCard({ domainName }) {
  const [selectedType, setSelectedType] = useState("ownership");
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [nftData, setNftData] = useState(null);

  const handleMint = async () => {
    if (!piAuth.isAuthenticated()) {
      alert("Please authenticate with Pi Network first");
      return;
    }

    setMinting(true);

    try {
      const result = await nftMinting.mintDomainCertificate({
        domainName,
        certificateType: selectedType,
      });

      if (result.success) {
        setMinted(true);
        setNftData(result.nft);
      }
    } catch (error) {
      console.error("Minting error:", error);
      alert("Minting failed: " + error.message);
    } finally {
      setMinting(false);
    }
  };

  const certInfo = CERTIFICATE_METADATA[selectedType];

  if (minted && nftData) {
    return (
      <div className="bg-gradient-to-br from-[#00ff9d]/10 to-[#00c6ff]/10 border border-[#00ff9d] rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">
            NFT Minted Successfully!
          </h3>
          <p className="text-sm text-gray-400">Token ID: {nftData.tokenId}</p>
        </div>

        <div className="bg-[#0a0e2b] rounded-lg p-4 mb-4">
          <div className="w-full h-48 relative mb-4">
            <Image
              src={nftData.metadata.image}
              alt={nftData.metadata.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
            />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">
            {nftData.metadata.name}
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            {nftData.metadata.description}
          </p>

          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Benefits:
            </p>
            {nftData.metadata.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <span className="text-[#00ff9d]">✓</span>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/dashboard/nfts")}
          className="w-full px-4 py-2 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-[#0a0e2b] font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          View My NFTs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Mint Domain Certificate NFT
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Create a luxury NFT certificate for {domainName.toUpperCase()} domain
        ownership
      </p>

      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-300">
          Certificate Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CERTIFICATE_TYPES).map(([key, value]) => {
            const info = CERTIFICATE_METADATA[value];
            return (
              <button
                key={value}
                onClick={() => setSelectedType(value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === value
                    ? "border-[#00ff9d] bg-[#00ff9d]/10"
                    : "border-gray-700 bg-gray-900 hover:border-gray-600"
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold text-white text-sm mb-1">{key}</p>
                  <p className="text-xs text-gray-400">{info.rarity}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-white mb-2">
          {certInfo.name}
        </h4>
        <p className="text-xs text-gray-400 mb-3">{certInfo.description}</p>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase font-semibold">
            Benefits:
          </p>
          {certInfo.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-gray-300"
            >
              <span className="text-[#00ff9d]">✓</span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleMint}
        disabled={minting}
        className="w-full px-6 py-3 bg-gradient-to-r from-[#00ff9d] to-[#00c6ff] text-[#0a0e2b] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {minting ? (
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
            Minting NFT...
          </span>
        ) : (
          `Mint ${certInfo.name}`
        )}
      </button>
    </div>
  );
}
