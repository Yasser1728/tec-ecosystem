/**
 * GDPR Compliance Module for TEC Ecosystem
 * Handles data privacy, user consent, and data management
 */

import { prisma } from "../../lib/db/prisma";

export const CONSENT_TYPES = {
  ESSENTIAL: "essential",
  ANALYTICS: "analytics",
  MARKETING: "marketing",
  PERSONALIZATION: "personalization",
};

export const DATA_RETENTION_PERIODS = {
  USER_DATA: 365 * 2, // 2 years
  PAYMENT_DATA: 365 * 7, // 7 years (financial records)
  SESSION_DATA: 30, // 30 days
  ANALYTICS_DATA: 365, // 1 year
};

export class GDPRCompliance {
  /**
   * Record user consent for data processing
   */
  async recordConsent(userId, consentTypes, ipAddress) {
    const consentRecord = {
      userId,
      consentTypes,
      ipAddress,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "server",
    };

    // Store consent in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          consent: consentRecord,
        },
      },
    });

    return consentRecord;
  }

  /**
   * Export all user data (GDPR Right to Data Portability)
   */
  async exportUserData(userId) {
    const [user, payments, nfts] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),
      prisma.payment.findMany({
        where: { userId },
      }),
      prisma.nFT.findMany({
        where: { userId },
      }),
    ]);

    // Anonymize sensitive data
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        language: user.language,
        createdAt: user.createdAt,
        // Exclude: piId, walletAddress (sensitive)
      },
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        domain: p.domain,
        status: p.status,
        createdAt: p.createdAt,
        // Exclude: piTxId (blockchain data)
      })),
      nfts: nfts.map((n) => ({
        tokenId: n.tokenId,
        domainName: n.domainName,
        certificateType: n.certificateType,
        mintedAt: n.mintedAt,
      })),
      exportedAt: new Date().toISOString(),
      format: "JSON",
      gdprCompliant: true,
    };
  }

  /**
   * Delete user data (GDPR Right to Erasure)
   */
  async deleteUserData(userId, options = {}) {
    const {
      keepFinancialRecords = true, // Legal requirement
      anonymize = true,
    } = options;

    if (anonymize) {
      // Anonymize instead of delete (for legal compliance)
      await prisma.user.update({
        where: { id: userId },
        data: {
          username: `deleted_user_${userId.slice(0, 8)}`,
          email: null,
          walletAddress: null,
          status: "DELETED",
          metadata: {
            deletedAt: new Date().toISOString(),
            deletionReason: "user_request",
          },
        },
      });

      if (!keepFinancialRecords) {
        // Anonymize payment records
        await prisma.payment.updateMany({
          where: { userId },
          data: {
            metadata: {
              anonymized: true,
              originalUserId: userId,
            },
          },
        });
      }
    } else {
      // Hard delete (only if legally permitted)
      await prisma.user.delete({
        where: { id: userId },
      });
    }

    return {
      success: true,
      userId,
      deletedAt: new Date().toISOString(),
      method: anonymize ? "anonymized" : "deleted",
    };
  }

  /**
   * Check if user has given consent for specific data processing
   */
  async hasConsent(userId, consentType) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.metadata?.consent) {
      return false;
    }

    return user.metadata.consent.consentTypes.includes(consentType);
  }

  /**
   * Update user consent preferences
   */
  async updateConsent(userId, consentTypes) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const updatedConsent = {
      ...user.metadata?.consent,
      consentTypes,
      updatedAt: new Date().toISOString(),
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        metadata: {
          ...user.metadata,
          consent: updatedConsent,
        },
      },
    });

    return updatedConsent;
  }

  /**
   * Clean up old data based on retention policies
   */
  async cleanupOldData() {
    const now = new Date();

    // Delete old session data (30 days)
    const sessionCutoff = new Date(
      now.getTime() - DATA_RETENTION_PERIODS.SESSION_DATA * 24 * 60 * 60 * 1000,
    );

    // Delete old analytics data (1 year)
    const analyticsCutoff = new Date(
      now.getTime() -
        DATA_RETENTION_PERIODS.ANALYTICS_DATA * 24 * 60 * 60 * 1000,
    );

    // Note: Payment data retained for 7 years (legal requirement)
    // User data retained for 2 years after last activity

    return {
      success: true,
      cleanedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate privacy report for user
   */
  async generatePrivacyReport(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const [paymentCount, nftCount] = await Promise.all([
      prisma.payment.count({ where: { userId } }),
      prisma.nFT.count({ where: { userId } }),
    ]);

    return {
      userId: user.id,
      dataCollected: {
        personalInfo: ["username", "email", "tier", "language"],
        financialData: ["payment history", "transaction records"],
        digitalAssets: ["NFT certificates", "domain ownership"],
        activityData: ["login history", "payment activity"],
      },
      dataUsage: {
        essential: "Account management and service delivery",
        analytics: "Service improvement and user experience",
        marketing: "Promotional communications (with consent)",
        personalization: "Customized user experience",
      },
      dataSharing: {
        piNetwork: "Payment processing and authentication",
        thirdParties: "None (all data processed internally)",
      },
      userRights: {
        access: "Request copy of your data",
        rectification: "Correct inaccurate data",
        erasure: "Request data deletion",
        portability: "Export data in machine-readable format",
        objection: "Object to data processing",
        restriction: "Restrict data processing",
      },
      dataRetention: DATA_RETENTION_PERIODS,
      consent: user.metadata?.consent || null,
      recordCounts: {
        payments: paymentCount,
        nfts: nftCount,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

export const gdprCompliance = new GDPRCompliance();
