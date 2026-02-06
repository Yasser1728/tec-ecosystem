/**
 * Pi Network API Base URL Configuration
 * 
 * Centralized management of Pi API base URLs based on environment.
 * Supports both sandbox/testnet and production environments.
 * 
 * Environment Variables:
 * - PI_SANDBOX_MODE: Server-side sandbox flag (true/false)
 * - NEXT_PUBLIC_PI_SANDBOX: Client-side sandbox flag (true/false)
 * - PI_SANDBOX_API_URL: Custom sandbox API URL (optional)
 * - PI_API_URL: Custom production API URL (optional)
 */

/**
 * Default Pi API URLs
 */
const DEFAULT_PRODUCTION_API_URL = 'https://api.minepi.com/v2';
const DEFAULT_SANDBOX_API_URL = 'https://sandbox-api.minepi.com/v2';

/**
 * Determines if sandbox mode is enabled
 * Checks both server and client environment variables
 * 
 * @returns {boolean} True if sandbox/testnet mode is enabled
 */
function isSandboxMode() {
  // Check server-side variable
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.PI_SANDBOX_MODE === 'true') {
      return true;
    }
    if (process.env.NEXT_PUBLIC_PI_SANDBOX === 'true') {
      return true;
    }
  }
  
  return false;
}

/**
 * Gets the appropriate Pi API base URL based on environment configuration
 * 
 * Logic:
 * - If PI_SANDBOX_MODE=true or NEXT_PUBLIC_PI_SANDBOX=true:
 *   - Use PI_SANDBOX_API_URL if set
 *   - Otherwise use default sandbox URL (https://sandbox-api.minepi.com/v2)
 * - Otherwise (production):
 *   - Use PI_API_URL if set
 *   - Otherwise use default production URL (https://api.minepi.com/v2)
 * 
 * @returns {string} The Pi API base URL to use
 */
function getPiApiBaseUrl() {
  const sandbox = isSandboxMode();
  
  if (sandbox) {
    // Sandbox/Testnet mode
    const customSandboxUrl = process.env.PI_SANDBOX_API_URL;
    return customSandboxUrl || DEFAULT_SANDBOX_API_URL;
  } else {
    // Production mode
    const customProductionUrl = process.env.PI_API_URL;
    return customProductionUrl || DEFAULT_PRODUCTION_API_URL;
  }
}

/**
 * Gets the current environment mode for logging/debugging
 * 
 * @returns {string} 'sandbox' or 'production'
 */
function getEnvironmentMode() {
  return isSandboxMode() ? 'sandbox' : 'production';
}

module.exports = {
  getPiApiBaseUrl,
  isSandboxMode,
  getEnvironmentMode,
  DEFAULT_PRODUCTION_API_URL,
  DEFAULT_SANDBOX_API_URL,
};
