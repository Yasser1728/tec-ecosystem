/**
 * TecPi Domain Routes
 *
 * API routes for user registration and management.
 * Integration point with nexus/gateway only - no direct domain coupling.
 *
 * @module domains/tecpi/routes
 */

const tecPiService = require("../index");

/**
 * Register user route handler
 * POST /api/tecpi/register
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
async function registerUserRoute(req, res) {
  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
      });
    }

    // Extract user data from request body
    const { username, email, password, fullName } = req.body;

    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Request body is required",
      });
    }

    // Call the service to register user
    const result = await tecPiService.registerUser({
      username,
      email,
      password,
      fullName,
    });

    // Return success response
    return res.status(201).json(result);
  } catch (error) {
    console.error("[TecPi Routes] Registration error:", error);

    // Return appropriate error response
    const statusCode =
      error.message.includes("already exists") ||
      error.message.includes("already registered") ||
      error.message.includes("Invalid") ||
      error.message.includes("Missing required fields")
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get user by username route handler
 * GET /api/tecpi/user/:username
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
async function getUserRoute(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed. Use GET.",
      });
    }

    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username parameter is required",
      });
    }

    const user = await tecPiService.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("[TecPi Routes] Get user error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
}

/**
 * Get domain statistics route handler
 * GET /api/tecpi/stats
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
async function getStatsRoute(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed. Use GET.",
      });
    }

    const stats = await tecPiService.getDomainStats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("[TecPi Routes] Get stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
}

module.exports = {
  registerUserRoute,
  getUserRoute,
  getStatsRoute,
};
