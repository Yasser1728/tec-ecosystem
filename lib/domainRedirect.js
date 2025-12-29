// Domain Redirect Handler
// Handles .pi domain routing in Pi Browser

import { domainMapping } from './domainMapping';

/**
 * Get the route for a given domain
 * @param {string} hostname - The domain (e.g., 'life.pi', 'fundx.pi')
 * @returns {string} - The route to redirect to (e.g., '/life', '/fundx')
 */
export function getDomainRoute(hostname) {
  // Remove port if present
  const domain = hostname.split(':')[0];
  
  // Check if it's a .pi domain
  if (domain.endsWith('.pi')) {
    const route = domainMapping[domain]?.route;
    if (route) {
      return route;
    }
  }
  
  // Default to home
  return '/';
}

/**
 * Check if the current domain is a .pi domain
 * @param {string} hostname - The domain
 * @returns {boolean}
 */
export function isPiDomain(hostname) {
  const domain = hostname.split(':')[0];
  return domain.endsWith('.pi');
}

/**
 * Get business unit from domain
 * @param {string} hostname - The domain
 * @returns {string|null}
 */
export function getBusinessUnitFromDomain(hostname) {
  const domain = hostname.split(':')[0];
  return domainMapping[domain]?.businessUnit || null;
}

/**
 * Get all domain info
 * @param {string} hostname - The domain
 * @returns {object|null}
 */
export function getDomainInfo(hostname) {
  const domain = hostname.split(':')[0];
  
  if (domainMapping[domain]) {
    return {
      domain,
      ...domainMapping[domain]
    };
  }
  
  return null;
}

// Example usage in pages:
// const domainInfo = getDomainInfo(req.headers.host);
// if (domainInfo) {
//   // User came from life.pi
//   // Show Life-specific content
// }
