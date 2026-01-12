// ============================================
// Domain Task Mapping
// Maps each domain to specific AI tasks
// ============================================

/**
 * Domain to tasks mapping
 * Each domain has an array of tasks that the AI agent should perform
 */
export const DOMAIN_TASK_MAP = {
  'tec': [
    'Generate ecosystem overview documentation',
    'Create integration guide for new domains',
    'Document API standards and best practices'
  ],
  'finance': [
    'Generate financial audit checklist',
    'Create transaction monitoring guidelines',
    'Document compliance requirements'
  ],
  'market': [
    'Generate marketplace listing guidelines',
    'Create product categorization schema',
    'Document vendor onboarding process'
  ],
  'wallet': [
    'Generate wallet security guidelines',
    'Create transaction flow documentation',
    'Document multi-currency support specs'
  ],
  'commerce': [
    'Generate e-commerce best practices guide',
    'Create payment integration checklist',
    'Document order fulfillment workflow'
  ],
  'analytics': [
    'Generate data pipeline architecture',
    'Create metrics and KPI definitions',
    'Document reporting requirements'
  ],
  'security': [
    'Generate security audit report template',
    'Create incident response playbook',
    'Document authentication standards'
  ],
  'crm': [
    'Generate customer journey map',
    'Create contact management schema',
    'Document sales pipeline stages'
  ],
  'payments': [
    'Generate payment gateway integration guide',
    'Create refund policy template',
    'Document fraud detection rules'
  ],
  'tokens': [
    'Generate tokenomics documentation',
    'Create token distribution plan',
    'Document staking mechanisms'
  ],
  'nft': [
    'Generate NFT minting guidelines',
    'Create metadata standards document',
    'Document royalty structure'
  ],
  'exchange': [
    'Generate trading pair configuration',
    'Create liquidity pool documentation',
    'Document order matching algorithm'
  ],
  'staking': [
    'Generate staking rewards calculator',
    'Create validator requirements document',
    'Document unstaking procedures'
  ],
  'governance': [
    'Generate voting mechanism documentation',
    'Create proposal template',
    'Document governance token utility'
  ],
  'insurance': [
    'Generate risk assessment framework',
    'Create policy template',
    'Document claims process'
  ],
  'tax': [
    'Generate tax reporting requirements',
    'Create compliance checklist',
    'Document jurisdiction-specific rules'
  ],
  'legal': [
    'Generate terms of service template',
    'Create privacy policy document',
    'Document regulatory compliance framework'
  ],
  'audit': [
    'Generate internal audit procedures',
    'Create ledger reconciliation guide',
    'Document audit trail requirements'
  ],
  'research': [
    'Generate research methodology guide',
    'Create data collection standards',
    'Document AI model evaluation criteria'
  ],
  'marketing': [
    'Generate marketing campaign template',
    'Create brand guidelines document',
    'Document social media strategy'
  ],
  'support': [
    'Generate support ticket workflow',
    'Create FAQ template',
    'Document escalation procedures'
  ],
  'hr': [
    'Generate employee onboarding checklist',
    'Create performance review template',
    'Document leave management policy'
  ],
  'devops': [
    'Generate CI/CD pipeline documentation',
    'Create deployment checklist',
    'Document infrastructure monitoring setup'
  ],
  'infra': [
    'Generate infrastructure architecture diagram',
    'Create scaling guidelines',
    'Document disaster recovery plan'
  ]
};

/**
 * Get all domain names
 * @returns {Array<string>} Array of domain names
 */
export function getAllDomains() {
  return Object.keys(DOMAIN_TASK_MAP);
}

/**
 * Get tasks for a specific domain
 * @param {string} domain - Domain name
 * @returns {Array<string>} Array of tasks for the domain
 */
export function getTasksForDomain(domain) {
  return DOMAIN_TASK_MAP[domain] || [];
}

/**
 * Check if a domain exists in the task map
 * @param {string} domain - Domain name
 * @returns {boolean} True if domain exists
 */
export function hasDomain(domain) {
  return domain in DOMAIN_TASK_MAP;
}
