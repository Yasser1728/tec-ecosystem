const fs = require("fs");
const path = require("path");
const { sanitizeName, safeResolveFile } = require("../lib/safe-paths");

// Import business units configuration
// Note: businessUnits.js uses ES6 exports but works with CommonJS require
// in Next.js environment due to transpilation support
const { businessUnits } = require("../lib/businessUnits");

/**
 * Generate domain folders safely with path traversal protection
 * Creates folders under apps/ directory for each domain
 */
function generateDomains() {
  try {
    // Get the list of 24 domain names
    const domainNames = Object.keys(businessUnits);

    console.log(`Found ${domainNames.length} domains to generate...`);

    // Base directory for apps
    const baseDir = path.resolve(__dirname, "..", "apps");

    // Ensure base directory exists
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log(`✓ Created base directory: ${baseDir}`);
    }

    // Process each domain
    let successCount = 0;
    let errorCount = 0;

    for (const domainName of domainNames) {
      try {
        // Sanitize the domain name
        const sanitizedName = sanitizeName(domainName);

        // Safely resolve the domain folder path
        const domainPath = safeResolveFile(baseDir, sanitizedName);

        // Create the domain folder if it doesn't exist
        if (!fs.existsSync(domainPath)) {
          fs.mkdirSync(domainPath, { recursive: true });
          console.log(`✓ Created domain folder: ${sanitizedName}`);
        } else {
          console.log(`  Already exists: ${sanitizedName}`);
        }

        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create domain "${domainName}": ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Domain Generation Complete`);
    console.log(`========================================`);
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log(`Total: ${domainNames.length}`);

    if (errorCount > 0) {
      console.error(`\n⚠ Exiting with errors...`);
      process.exit(1);
    }

    console.log(`\n✓ All domains generated successfully!`);
    process.exit(0);
  } catch (error) {
    console.error(`\n✗ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  generateDomains();
}

module.exports = { generateDomains };
