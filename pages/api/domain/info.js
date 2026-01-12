// Domain Info API
// Exposes domain metadata to frontend

import { getDomainConfig } from '../../../lib/config/domain-registry';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get domain information from request headers (set by middleware)
    const domainName = req.headers['x-domain-name'];
    const domainNameAr = req.headers['x-domain-name-ar'];
    const domainTier = req.headers['x-domain-tier'];
    const domainTheme = req.headers['x-domain-theme'];
    const domainAnalytics = req.headers['x-domain-analytics'];
    const domainIndependent = req.headers['x-domain-independent'];
    const domainValue = req.headers['x-domain-value'];
    const hostname = req.headers['host'];

    // If domain headers are present, use them
    if (domainName) {
      return res.status(200).json({
        name: domainName,
        nameAr: domainNameAr,
        tier: domainTier,
        theme: domainTheme,
        analytics: domainAnalytics,
        independent: domainIndependent === 'true',
        value: domainValue,
        hostname: hostname,
      });
    }

    // Otherwise, try to get domain config from hostname
    const domainConfig = getDomainConfig(hostname);
    
    if (domainConfig) {
      return res.status(200).json({
        name: domainConfig.name,
        nameAr: domainConfig.nameAr,
        tier: domainConfig.tier,
        theme: domainConfig.theme,
        analytics: domainConfig.analytics,
        independent: domainConfig.independent,
        value: domainConfig.value,
        hostname: hostname,
      });
    }

    // Return default if not a recognized domain
    return res.status(200).json({
      name: 'TEC Ecosystem',
      nameAr: 'تِك النظام البيئي',
      tier: 'Hub',
      theme: 'tec-primary',
      analytics: 'tec-analytics',
      independent: false,
      value: 'central-hub',
      hostname: hostname,
    });

  } catch (error) {
    console.error('Domain info API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
