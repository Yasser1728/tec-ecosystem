/**
 * Task Map for Sovereign Agent
 * Defines domain-specific tasks and outputs
 */

const TASK_MAP = [
  {
    domain: 'tec',
    prompt: 'Generate core TEC services documentation and setup guide',
    output: 'README.md'
  },
  {
    domain: 'finance',
    prompt: 'Create financial module integration guide',
    output: 'integration.md'
  },
  {
    domain: 'market',
    prompt: 'Setup marketplace logic and product catalog structure',
    output: 'catalog.md'
  }
];

export default TASK_MAP;
