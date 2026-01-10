// index.js (root)
// Launcher entrypoint for the AI agent module while preserving ESM exports.

export { runSovereignTaskMap } from './ai-agent/domain-task-map.js';

// If this package previously exported other symbols, preserve them here.
// (No other exports are declared in this file to avoid breaking consumers.)

import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Execute when run directly: node index.js
const __filename = fileURLToPath(import.meta.url);
const invoked = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (invoked) {
  const { runSovereignTaskMap } = await import('./ai-agent/domain-task-map.js');
  await runSovereignTaskMap();
}
