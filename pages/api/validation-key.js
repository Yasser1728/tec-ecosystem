/**
 * Pi Network Validation Key Endpoint
 * Serves the validation key required by Pi Platform for app verification
 * This endpoint is mapped to /validation-key.txt in vercel.json
 */

export default function handler(req, res) {
  const validationKey = process.env.PI_VALIDATION_KEY;

  if (!validationKey) {
    console.error(
      "❌ PI_VALIDATION_KEY not configured. Please add it to your environment variables."
    );
    console.error(
      "Get your validation key from: Pi Developer Portal → Your App → Settings → Validation Key"
    );
    console.error(
      "For Vercel: Settings → Environment Variables → Add PI_VALIDATION_KEY"
    );
    console.error("For local dev: Add PI_VALIDATION_KEY to .env.local");

    return res.status(500).json({
      error: "Validation key not configured",
      message:
        "PI_VALIDATION_KEY environment variable is missing. Please configure it in your environment.",
      help: {
        local: "Add PI_VALIDATION_KEY to your .env.local file",
        vercel: "Add PI_VALIDATION_KEY in Vercel Dashboard → Settings → Environment Variables",
        getPiKey:
          "Get your key from Pi Developer Portal → Your App → Settings → Validation Key",
      },
    });
  }

  // Return validation key as plain text (required by Pi Platform)
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
  res.status(200).send(validationKey);
}
