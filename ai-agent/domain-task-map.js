// Domain task map for the AI agent. Tasks are grouped per domain.
// This file defines the task configurations for each domain in the TEC ecosystem.

import { TASK_TYPES } from './core/council.js';

/**
 * Domain Task Map
 * Defines specific task configurations for each domain
 * 
 * Each domain entry contains:
 * - taskType: The primary task type for this domain
 * - requiresAudit: Whether operations require audit verification
 * - priority: Execution priority (1 = highest)
 * - capabilities: Required AI capabilities
 * - description: Human-readable description
 */
export const domainTaskMap = Object.freeze({
  // Core Domains
  'tec.pi': {
    taskType: TASK_TYPES.STRATEGY,
    requiresAudit: true,
    priority: 1,
    capabilities: ['strategy', 'planning', 'analysis'],
    description: 'TEC Ecosystem core strategy and coordination'
  },
  'finance.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 1,
    capabilities: ['analysis', 'calculation', 'verification'],
    description: 'Financial operations and treasury management'
  },
  'market.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 2,
    capabilities: ['analysis', 'data-processing'],
    description: 'Market analysis and trading operations'
  },
  'wallet.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 1,
    capabilities: ['security', 'verification'],
    description: 'Wallet management and transaction processing'
  },
  'commerce.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: false,
    priority: 2,
    capabilities: ['coding', 'general'],
    description: 'E-commerce and marketplace operations'
  },

  // Analytics Domains
  'analytics.pi': {
    taskType: TASK_TYPES.DATA,
    requiresAudit: false,
    priority: 3,
    capabilities: ['data-processing', 'analysis'],
    description: 'Data analytics and insights generation'
  },
  'tokens.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 2,
    capabilities: ['verification', 'analysis'],
    description: 'Token management and tokenomics'
  },
  'nft.pi': {
    taskType: TASK_TYPES.DEVELOPMENT,
    requiresAudit: false,
    priority: 3,
    capabilities: ['coding', 'general'],
    description: 'NFT minting and management'
  },
  'exchange.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 1,
    capabilities: ['security', 'verification'],
    description: 'Exchange operations and order processing'
  },

  // Management Domains
  'crm.pi': {
    taskType: TASK_TYPES.FAST,
    requiresAudit: false,
    priority: 4,
    capabilities: ['general', 'conversation'],
    description: 'Customer relationship management'
  },
  'payments.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 1,
    capabilities: ['security', 'verification'],
    description: 'Payment processing and reconciliation'
  },
  'governance.pi': {
    taskType: TASK_TYPES.STRATEGY,
    requiresAudit: true,
    priority: 2,
    capabilities: ['strategy', 'reasoning'],
    description: 'Governance and voting mechanisms'
  },
  'legal.pi': {
    taskType: TASK_TYPES.REASONING,
    requiresAudit: true,
    priority: 2,
    capabilities: ['reasoning', 'analysis'],
    description: 'Legal compliance and documentation'
  },
  'audit.pi': {
    taskType: TASK_TYPES.AUDIT,
    requiresAudit: false,
    priority: 1,
    capabilities: ['audit', 'verification', 'security'],
    description: 'Internal audit and compliance verification'
  },

  // Security & Compliance
  'security.pi': {
    taskType: TASK_TYPES.AUDIT,
    requiresAudit: false,
    priority: 1,
    capabilities: ['security', 'audit'],
    description: 'Security monitoring and threat detection'
  },
  'insurance.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 3,
    capabilities: ['analysis', 'calculation'],
    description: 'Insurance policies and claims'
  },
  'tax.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 3,
    capabilities: ['calculation', 'analysis'],
    description: 'Tax calculations and reporting'
  },

  // Operations
  'staking.pi': {
    taskType: TASK_TYPES.OPERATION,
    requiresAudit: true,
    priority: 2,
    capabilities: ['calculation', 'verification'],
    description: 'Staking rewards and management'
  },
  'research.pi': {
    taskType: TASK_TYPES.REASONING,
    requiresAudit: false,
    priority: 4,
    capabilities: ['reasoning', 'knowledge'],
    description: 'Research and development initiatives'
  },
  'marketing.pi': {
    taskType: TASK_TYPES.FAST,
    requiresAudit: false,
    priority: 4,
    capabilities: ['general', 'conversation'],
    description: 'Marketing campaigns and content'
  },
  'support.pi': {
    taskType: TASK_TYPES.FAST,
    requiresAudit: false,
    priority: 3,
    capabilities: ['conversation', 'general'],
    description: 'Customer support and help desk'
  },
  'hr.pi': {
    taskType: TASK_TYPES.FAST,
    requiresAudit: false,
    priority: 4,
    capabilities: ['general', 'conversation'],
    description: 'Human resources management'
  },

  // Infrastructure
  'devops.pi': {
    taskType: TASK_TYPES.DEVELOPMENT,
    requiresAudit: false,
    priority: 2,
    capabilities: ['coding', 'debugging'],
    description: 'DevOps and CI/CD pipelines'
  },
  'infra.pi': {
    taskType: TASK_TYPES.ARCHITECTURE,
    requiresAudit: true,
    priority: 2,
    capabilities: ['architecture', 'security'],
    description: 'Infrastructure and cloud management'
  }
});

/**
 * Get task configuration for a domain
 * @param {string} domain - Domain name
 * @returns {Object|null} Task configuration or null if not found
 */
export function getTaskConfig(domain) {
  return domainTaskMap[domain] || null;
}

/**
 * Get domains by priority
 * @param {number} maxPriority - Maximum priority level (inclusive)
 * @returns {string[]} Array of domain names
 */
export function getDomainsByPriority(maxPriority) {
  return Object.entries(domainTaskMap)
    .filter(([, config]) => config.priority <= maxPriority)
    .map(([domain]) => domain);
}

/**
 * Get domains that require audit
 * @returns {string[]} Array of domain names requiring audit
 */
export function getAuditRequiredDomains() {
  return Object.entries(domainTaskMap)
    .filter(([, config]) => config.requiresAudit)
    .map(([domain]) => domain);
}

/**
 * Get all domain names
 * @returns {string[]} Array of all domain names
 */
export function getAllDomains() {
  return Object.keys(domainTaskMap);
}
