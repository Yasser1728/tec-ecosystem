/**
 * NFT Minting Module for Domain Ownership Certificates
 * Luxury NFT certificates for TEC Ecosystem domains
 */

import { piPayments } from './pi-payments';
import { piAuth } from './pi-auth';

export const CERTIFICATE_TYPES = {
  OWNERSHIP: 'ownership',
  PREMIUM: 'premium',
  VIP: 'vip',
  FOUNDER: 'founder'
};

export const CERTIFICATE_METADATA = {
  ownership: {
    name: 'Domain Ownership Certificate',
    description: 'Official ownership certificate for TEC Ecosystem domain',
    rarity: 'Standard',
    benefits: ['Domain access', 'Basic features', 'Community membership']
  },
  premium: {
    name: 'Premium Domain Certificate',
    description: 'Premium tier certificate with enhanced benefits',
    rarity: 'Rare',
    benefits: ['Premium features', 'Priority support', 'Exclusive events', 'Revenue sharing']
  },
  vip: {
    name: 'VIP Domain Certificate',
    description: 'VIP tier certificate with luxury benefits',
    rarity: 'Epic',
    benefits: ['All premium benefits', 'VIP lounge access', 'Personal concierge', 'Governance rights']
  },
  founder: {
    name: 'Founder Domain Certificate',
    description: 'Limited edition founder certificate',
    rarity: 'Legendary',
    benefits: ['All VIP benefits', 'Lifetime access', 'Founder badge', 'Maximum governance rights']
  }
};

export class NFTMinting {
  constructor() {
    this.mintingQueue = [];
  }

  async mintDomainCertificate({ domainName, certificateType = 'ownership' }) {
    const user = piAuth.getUser();
    if (!user) {
      throw new Error('User must be authenticated');
    }

    // Create payment for minting
    const paymentResult = await piPayments.createNFTMintingPayment({
      domainName,
      certificateType
    });

    if (!paymentResult.success) {
      throw new Error('Payment failed: ' + paymentResult.error);
    }

    // Generate NFT metadata
    const metadata = this.generateMetadata(domainName, certificateType, user);

    // Create NFT record
    const nftResult = await this.createNFTRecord({
      domainName,
      certificateType,
      metadata,
      paymentId: paymentResult.internalId
    });

    return nftResult;
  }

  generateMetadata(domainName, certificateType, user) {
    const certInfo = CERTIFICATE_METADATA[certificateType] || CERTIFICATE_METADATA.ownership;
    
    return {
      name: `${domainName.toUpperCase()} - ${certInfo.name}`,
      description: certInfo.description,
      image: this.generateCertificateImageUrl(domainName, certificateType),
      attributes: [
        {
          trait_type: 'Domain',
          value: domainName.toUpperCase()
        },
        {
          trait_type: 'Certificate Type',
          value: certificateType
        },
        {
          trait_type: 'Rarity',
          value: certInfo.rarity
        },
        {
          trait_type: 'Owner',
          value: user.username
        },
        {
          trait_type: 'Minted Date',
          value: new Date().toISOString()
        },
        {
          trait_type: 'Ecosystem',
          value: 'TEC Luxury Domains'
        }
      ],
      benefits: certInfo.benefits,
      external_url: `https://tec-ecosystem.com/nft/${domainName}`,
      animation_url: this.generateAnimationUrl(domainName, certificateType)
    };
  }

  generateCertificateImageUrl(domainName, certificateType) {
    // In production, this would generate actual certificate images
    return `/api/nft/certificate-image?domain=${domainName}&type=${certificateType}`;
  }

  generateAnimationUrl(domainName, certificateType) {
    // In production, this would generate animated certificates
    return `/api/nft/certificate-animation?domain=${domainName}&type=${certificateType}`;
  }

  async createNFTRecord({ domainName, certificateType, metadata, paymentId }) {
    try {
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domainName,
          certificateType,
          metadata,
          paymentId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create NFT record');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('NFT creation failed:', error);
      throw error;
    }
  }

  async getUserNFTs(userId) {
    try {
      const response = await fetch(`/api/nft/user-nfts?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user NFTs');
      }

      const data = await response.json();
      return data.nfts;
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
      return [];
    }
  }

  async getNFTDetails(tokenId) {
    try {
      const response = await fetch(`/api/nft/details?tokenId=${tokenId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFT details');
      }

      const data = await response.json();
      return data.nft;
    } catch (error) {
      console.error('Failed to fetch NFT details:', error);
      return null;
    }
  }

  async transferNFT(tokenId, toUserId) {
    try {
      const response = await fetch('/api/nft/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenId,
          toUserId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to transfer NFT');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('NFT transfer failed:', error);
      throw error;
    }
  }
}

export const nftMinting = new NFTMinting();
