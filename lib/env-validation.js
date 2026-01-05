/**
 * Environment Variable Validation
 * Ensures all required environment variables are set on startup
 */

const REQUIRED_ENV_VARS = {
  // Authentication
  NEXTAUTH_URL: "NextAuth URL for authentication",
  NEXTAUTH_SECRET: "NextAuth secret key",

  // Database
  DATABASE_URL: "Database connection URL",

  // Optional but recommended
};

const OPTIONAL_ENV_VARS = {
  // Pi Network Integration
  PI_API_KEY: "Pi Network API key (optional)",

  // Other optional vars
  RATE_LIMIT_MAX: "Rate limiting max requests (optional)",
};

/**
 * Validates that all required environment variables are set
 * @throws {Error} If required variables are missing
 */
export function validateEnvironment() {
  const missing = [];
  const warnings = [];

  // Check required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, description]) => {
    if (!process.env[key]) {
      missing.push(`${key} - ${description}`);
    }
  });

  // Check optional variables (warnings only)
  Object.entries(OPTIONAL_ENV_VARS).forEach(([key, description]) => {
    if (!process.env[key]) {
      warnings.push(`${key} - ${description}`);
    }
  });

  if (missing.length > 0) {
    // console.error("❌ Missing required environment variables:");
    missing.forEach((item) => // console.error(`  - ${item}`));
    throw new Error(
      "Required environment variables are not set. Check env.local.example for reference.",
    );
  }

  if (warnings.length > 0) {
    // console.warn("⚠️  Optional environment variables not set:");
    warnings.forEach((item) => // console.warn(`  - ${item}`));
  }

  // console.log("✅ Environment variables validated successfully");
}

/**
 * Validates sensitive keys are not exposed
 * @param {Object} publicEnv - Environment variables to check
 */
export function validateNoSecretsExposed(publicEnv = {}) {
  const sensitivePatterns = [
    /secret/i,
    /key/i,
    /password/i,
    /token/i,
    /credential/i,
  ];

  const exposed = Object.keys(publicEnv).filter((key) =>
    sensitivePatterns.some((pattern) => pattern.test(key)),
  );

  if (exposed.length > 0) {
    // console.error(
      "⚠️  WARNING: Potentially sensitive environment variables exposed:",
    );
    exposed.forEach((key) => // console.error(`  - ${key}`));
  }
}

/**
 * Gets environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value
 * @returns {string} - Environment variable value or fallback
 */
export function getEnvVar(key, fallback = "") {
  return process.env[key] || fallback;
}

/**
 * Checks if running in production
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Checks if running in development
 * @returns {boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
