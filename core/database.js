/**
 * Core Database Configuration
 *
 * Provides database isolation patterns for all domains
 * Each domain gets its own isolated database/schema
 */

/**
 * Domain database mapping
 * Each domain has its own database identifier
 */
export const DOMAIN_DATABASES = {
  life: "life_db",
  insure: "insure_db",
  commerce: "commerce_db",
  ecommerce: "ecommerce_db",
  assets: "assets_db",
  fundx: "fundx_db",
  dx: "dx_db",
  analytics: "analytics_db",
  nbf: "nbf_db",
  epic: "epic_db",
  legend: "legend_db",
  connection: "connection_db",
  system: "system_db",
  alert: "alert_db",
  tec: "tec_db",
  estate: "estate_db",
  nx: "nx_db",
  explorer: "explorer_db",
  nexus: "nexus_db",
  brookfield: "brookfield_db",
  vip: "vip_db",
  titan: "titan_db",
  zone: "zone_db",
  elite: "elite_db",
};

/**
 * Get database name for a domain
 */
export function getDomainDatabase(domainName) {
  return DOMAIN_DATABASES[domainName] || `${domainName}_db`;
}

/**
 * Database configuration for a domain
 */
export function getDomainDatabaseConfig(domainName) {
  const databaseName = getDomainDatabase(domainName);

  return {
    database: databaseName,
    // In production, each domain would have its own connection string
    // For now, we use Prisma's schema-based isolation
    connectionString: process.env.DATABASE_URL,
    schema: databaseName,
    isolation: "schema", // schema-based isolation within single database
    poolSize: 10,
    timeout: 30000,
  };
}

/**
 * Initialize database for a domain
 */
export async function initializeDomainDatabase(domainName) {
  const config = getDomainDatabaseConfig(domainName);

  console.log(
    `[Database Init] Initializing database for ${domainName}:`,
    config,
  );

  // TODO: In production, create separate database or schema
  // For now, we use the shared Prisma client with domain field filtering

  return {
    initialized: true,
    domain: domainName,
    database: config.database,
    schema: config.schema,
  };
}

/**
 * Get all domain databases
 */
export function getAllDomainDatabases() {
  return Object.entries(DOMAIN_DATABASES).map(([domain, database]) => ({
    domain,
    database,
    config: getDomainDatabaseConfig(domain),
  }));
}

export default {
  DOMAIN_DATABASES,
  getDomainDatabase,
  getDomainDatabaseConfig,
  initializeDomainDatabase,
  getAllDomainDatabases,
};
