/**
 * Pi API Base URL Configuration
 * 
 * Centralized helper to select the correct Pi API base URL based on environment settings.
 * This ensures all payment API calls use the correct URL for sandbox/testnet or production.
 * 
 * Environment Variables:
 * - PI_SANDBOX_MODE: Server-side flag for sandbox mode
 * - NEXT_PUBLIC_PI_SANDBOX: Client-side flag for sandbox mode
 * - PI_SANDBOX_API_URL: Custom sandbox API URL (optional)
 * - PI_API_URL: Custom production API URL (optional)
 * 
 * Default URLs:
 * - Sandbox/Testnet: https://sandbox-api.minepi.com/v2
 * - Production: https://api.minepi.com/v2
 */

/**
 * Get the Pi API base URL based on current environment
 * Safe for both server and client contexts (no window access)
 * 
 * @returns {string} The Pi API base URL
 */
export function getPiApiBaseUrl() {
  // Check if sandbox/testnet mode is enabled
  // Support both server-side (PI_SANDBOX_MODE) and client-side (NEXT_PUBLIC_PI_SANDBOX) flags
  const isSandbox = 
    process.env.PI_SANDBOX_MODE === 'true' || 
    process.env.NEXT_PUBLIC_PI_SANDBOX === 'true';

  if (isSandbox) {
    // Use custom sandbox URL if provided, otherwise default
    return process.env.PI_SANDBOX_API_URL || 'https://sandbox-api.minepi.com/v2';
  } else {
    // Use custom production URL if provided, otherwise default
    return process.env.PI_API_URL || 'https://api.minepi.com/v2';
  }
}

/**
 * Check if sandbox mode is enabled
 * 
 * @returns {boolean} True if sandbox mode is enabled
 */
export function isSandboxMode() {
  return (
    process.env.PI_SANDBOX_MODE === 'true' || 
    process.env.NEXT_PUBLIC_PI_SANDBOX === 'true'
  );
}
