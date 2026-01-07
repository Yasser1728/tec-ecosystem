/**
 * TecPi Domain Statistics API
 * GET /api/tecpi/stats
 *
 * Returns domain statistics through the nexus/gateway integration pattern.
 * No direct dependencies on other domains - fully sovereign.
 */

const tecPiRoutes = require("../../../domains/tecpi/routes");

/**
 * API handler for domain statistics
 *
 * @param {Object} req - Next.js API request object
 * @param {Object} res - Next.js API response object
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
  // Delegate to domain route handler
  return tecPiRoutes.getStatsRoute(req, res);
}
