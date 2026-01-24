/**
 * Pi Network Configuration Validator
 * Validates that all required Pi Network environment variables are properly configured
 */

/**
 * Check if Pi Network is properly configured
 * @returns {Object} Validation result with status and missing variables
 */
export function validatePiConfig() {
  const isSandbox =
    process.env.NEXT_PUBLIC_PI_SANDBOX === "true" ||
    process.env.PI_SANDBOX_MODE === "true";

  const requiredVars = {
    // Required for both sandbox and production
    NEXT_PUBLIC_PI_APP_ID: process.env.NEXT_PUBLIC_PI_APP_ID,
    NEXT_PUBLIC_PI_SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX,
  };

  // Additional requirements based on environment
  if (isSandbox) {
    requiredVars.PI_SANDBOX_MODE = process.env.PI_SANDBOX_MODE;
    requiredVars.PI_SANDBOX_ID = process.env.PI_SANDBOX_ID;
  } else {
    // Production mode requires API key and validation key
    requiredVars.PI_API_KEY = process.env.PI_API_KEY;
    requiredVars.PI_VALIDATION_KEY = process.env.PI_VALIDATION_KEY;
  }

  const missing = [];
  const warnings = [];

  // Check required variables
  for (const [key, value] of Object.entries(requiredVars)) {
    // Check if missing or has placeholder value
    if (!value || 
        value === `your_${key.toLowerCase()}_here` || 
        value === "your-pi-app-id" ||
        value === "your_pi_api_key_here" ||
        value === "your_pi_validation_key_here" ||
        value === "your_sandbox_id_here" ||
        value.trim() === "") {
      missing.push(key);
    }
  }

  // Check optional but recommended variables (only warnings for missing)
  if (!process.env.PI_API_SECRET) {
    warnings.push("PI_API_SECRET");
  }
  if (!process.env.PI_WALLET_ADDRESS) {
    warnings.push("PI_WALLET_ADDRESS");
  }

  const isValid = missing.length === 0;

  return {
    isValid,
    isSandbox,
    missing,
    warnings,
    message: isValid
      ? `Pi Network configured successfully (${isSandbox ? "sandbox" : "production"} mode)`
      : `Missing required Pi Network configuration: ${missing.join(", ")}`,
  };
}

/**
 * Get user-friendly error message for missing Pi configuration
 * @param {Array} missing - Array of missing variable names
 * @returns {string} Error message with instructions
 */
export function getMissingConfigMessage(missing) {
  if (!missing || missing.length === 0) {
    return "";
  }

  const messages = {
    NEXT_PUBLIC_PI_APP_ID:
      "NEXT_PUBLIC_PI_APP_ID: Get your App ID from Pi Developer Portal (https://developers.minepi.com)",
    PI_API_KEY:
      "PI_API_KEY: Generate an API key in Pi Developer Portal → Your App → API Keys",
    PI_VALIDATION_KEY:
      "PI_VALIDATION_KEY: Copy your validation key from Pi Developer Portal → Your App → Settings",
    PI_SANDBOX_ID:
      "PI_SANDBOX_ID: Get your Sandbox ID from Pi Developer Portal → Your App → Sandbox Settings",
    NEXT_PUBLIC_PI_SANDBOX:
      "NEXT_PUBLIC_PI_SANDBOX: Set to 'true' for sandbox/testnet or 'false' for production",
    PI_SANDBOX_MODE:
      "PI_SANDBOX_MODE: Set to 'true' for sandbox/testnet or 'false' for production",
  };

  const instructions = missing.map((key) => `  • ${messages[key] || key}`);

  return `
⚠️  Pi Network Configuration Error

The following environment variables are missing or not configured:

${instructions.join("\n")}

Please follow these steps:
1. Go to Pi Developer Portal: https://developers.minepi.com
2. Select or create your app
3. Copy the required credentials
4. Add them to your environment variables:
   - For local development: Add to .env.local
   - For Vercel: Add in Settings → Environment Variables
5. Restart your development server or redeploy

For detailed setup instructions, see:
- PI_SANDBOX_SETUP.md (for sandbox configuration)
- PI_NETWORK_SETUP.md (for general setup)
`;
}

/**
 * Validate Pi configuration and throw error if invalid (for server-side use)
 * @param {boolean} requireProduction - Whether to require production configuration
 * @throws {Error} If configuration is invalid
 */
export function requirePiConfig(requireProduction = false) {
  const validation = validatePiConfig();

  if (!validation.isValid) {
    const errorMessage = getMissingConfigMessage(validation.missing);
    console.error(errorMessage);
    throw new Error(
      `Pi Network not configured properly. Missing: ${validation.missing.join(", ")}`
    );
  }

  if (requireProduction && validation.isSandbox) {
    throw new Error(
      "Pi Network is in sandbox mode. Production mode required for this operation."
    );
  }

  return validation;
}

/**
 * Get Pi API configuration based on current mode
 * @returns {Object} API configuration
 */
export function getPiApiConfig() {
  const isSandbox =
    process.env.NEXT_PUBLIC_PI_SANDBOX === "true" ||
    process.env.PI_SANDBOX_MODE === "true";

  return {
    apiUrl: isSandbox
      ? "https://sandbox-api.minepi.com/v2"
      : "https://api.minepi.com/v2",
    apiKey: process.env.PI_API_KEY,
    appId: process.env.NEXT_PUBLIC_PI_APP_ID,
    sandbox: isSandbox,
    validationKey: process.env.PI_VALIDATION_KEY,
    sandboxId: process.env.PI_SANDBOX_ID,
  };
}
