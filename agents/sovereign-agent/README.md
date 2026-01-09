# Sovereign AI Agent

## Overview

The Sovereign AI Agent is a production-ready, headless CLI agent integrated with OpenRouter that automatically generates domain-specific documentation and outputs for the TEC Ecosystem. It implements an intelligent free-first model selection strategy with automatic paid fallback, ensuring cost-effective operation while maintaining reliability.

## Features

- **🆓 Free-First Strategy**: Automatically tries free models before falling back to paid options
- **💰 Cost-Efficient**: Minimizes API costs while ensuring task completion
- **📊 Ledger Tracking**: Maintains detailed logs of all operations with timestamps and usage metrics
- **🔒 Crash-Safe**: Incrementally updates ledger after each task for data integrity
- **📁 Organized Output**: Writes domain-specific files to structured directories
- **🚀 Node.js 20+ Native**: Uses native fetch (no node-fetch dependency)
- **⚡ ESM Compatible**: Fully compatible with ECMAScript modules

## Architecture

```
agents/sovereign-agent/
├── index.js                  # Main agent runner
├── openrouter.client.js      # OpenRouter API client with free-first strategy
├── task-map.js               # Domain to tasks mapping
├── ledger.json               # Runtime ledger (auto-generated)
└── README.md                 # This file
```

## How It Works

1. **Task Mapping**: Each domain has predefined tasks in `task-map.js`
2. **Model Selection**: 
   - First tries free models (Gemini Flash, Llama 3.2, Mistral 7B, etc.)
   - Falls back to paid model (default: GPT-4o Mini) if all free models fail
3. **Output Generation**: Creates Markdown documentation for each task
4. **File Organization**: Saves outputs to `domains/<domain>/<task-slug>.md`
5. **Ledger Tracking**: Records every operation with model, usage, timing, and file path

## Environment Variables

Create a `.env` file in the project root with the following variables:

### Required

```bash
# OpenRouter API Key (get from https://openrouter.ai/keys)
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### Optional

```bash
# Paid model fallback (default: openai/gpt-4o-mini)
OR_PAID_MODEL=openai/gpt-4o-mini

# HTTP Referer for OpenRouter rankings
OPENROUTER_HTTP_REFERER=https://github.com/Yasser1728/tec-ecosystem

# Application title for OpenRouter rankings
OPENROUTER_APP_TITLE=TEC Sovereign AI Agent
```

## Usage

### Run the Agent

```bash
npm run agent:run
```

### What Happens

1. Agent initializes ledger if not exists
2. Iterates through all domains (tec, finance, market, wallet, etc.)
3. For each domain, processes all tasks
4. Tries free models first, falls back to paid if needed
5. Writes outputs to `domains/<domain>/` directory
6. Appends entry to ledger after each task
7. Displays summary of successful and failed tasks

### Example Output

```
🚀 Sovereign AI Agent Starting...

════════════════════════════════════════════════════════════
🏗️  Domain: finance (3 tasks)
════════════════════════════════════════════════════════════

🔄 Processing: finance - Generate financial audit checklist
🔄 Trying free model: google/gemini-flash-1.5-8b
✅ Success with free model: google/gemini-flash-1.5-8b
📁 Created domain directory: finance
📝 Wrote output to: domains/finance/generate-financial-audit-checklist.md
✅ Completed: finance - Generate financial audit checklist
   Model: google/gemini-flash-1.5-8b
   Duration: 2341ms

...

════════════════════════════════════════════════════════════
🎉 Sovereign AI Agent Completed
════════════════════════════════════════════════════════════
📊 Total tasks: 72
✅ Successful: 70
❌ Failed: 2
📋 Ledger: agents/sovereign-agent/ledger.json
📁 Outputs: domains/
════════════════════════════════════════════════════════════
```

## Ledger Format

The ledger is a JSON array where each entry contains:

```json
{
  "domain": "finance",
  "task": "Generate financial audit checklist",
  "model": "google/gemini-flash-1.5-8b",
  "usage": {
    "prompt_tokens": 234,
    "completion_tokens": 892,
    "total_tokens": 1126
  },
  "output_file": "domains/finance/generate-financial-audit-checklist.md",
  "timestamp": "2026-01-09T17:30:45.123Z",
  "duration_ms": 2341
}
```

## Free Models Used

The agent tries these models in order (all free):

1. `google/gemini-flash-1.5-8b` - Fast and efficient
2. `meta-llama/llama-3.2-3b-instruct:free` - Meta's latest
3. `microsoft/phi-3-mini-128k-instruct:free` - Microsoft's compact model
4. `mistralai/mistral-7b-instruct:free` - Mistral AI's base model
5. `nousresearch/hermes-3-llama-3.1-405b:free` - Large context window
6. `qwen/qwen-2-7b-instruct:free` - Alibaba's multilingual model

## Paid Fallback

If all free models fail (rate limits, errors, etc.), the agent automatically falls back to:

- **Default**: `openai/gpt-4o-mini`
- **Customizable**: Set `OR_PAID_MODEL` environment variable

## Security Notes

### ⚠️ Important Security Practices

1. **Never commit `.env` file**: Contains sensitive API keys
2. **Protect API keys**: Keep your OpenRouter API key private
3. **Use environment variables**: Always use `.env` for configuration
4. **Review outputs**: Check generated content before using in production
5. **Rate limiting**: Agent includes 1-second delay between tasks
6. **Ledger privacy**: Ledger is gitignored by default (contains usage data)

### What's Gitignored

```
agents/sovereign-agent/ledger.json  # Runtime ledger
domains/*/*.md                       # Generated outputs
```

### What's Committed

```
agents/sovereign-agent/index.js             # Agent code
agents/sovereign-agent/openrouter.client.js # Client code
agents/sovereign-agent/task-map.js          # Task definitions
.env.example                                 # Template (no secrets)
```

## Customization

### Add New Domain

Edit `task-map.js`:

```javascript
export const DOMAIN_TASK_MAP = {
  // ... existing domains
  'new-domain': [
    'Task 1 description',
    'Task 2 description',
    'Task 3 description'
  ]
};
```

### Change Free Models Priority

Edit `openrouter.client.js`:

```javascript
const FREE_MODELS = [
  'your-preferred-free-model',
  'second-choice-free-model',
  // ... more models
];
```

### Change Paid Fallback

Set environment variable:

```bash
OR_PAID_MODEL=anthropic/claude-3.5-sonnet
```

## Troubleshooting

### "OPENROUTER_API_KEY environment variable is required"

**Solution**: Create `.env` file with your OpenRouter API key.

### "All models failed"

**Possible causes**:
1. Invalid API key
2. Rate limit exceeded
3. Network issues
4. Model availability issues

**Solution**: Check your API key, wait a few minutes, and try again.

### No output files created

**Check**:
1. Agent has write permissions to `domains/` directory
2. Task completed successfully (check logs)
3. Ledger shows success entries

### Ledger not updating

**Possible causes**:
1. JSON syntax error (corrupted file)
2. File permissions issue

**Solution**: Delete `ledger.json` and let agent recreate it.

## Performance

- **Average task duration**: 1-3 seconds (free models)
- **Memory usage**: ~50-100MB
- **Disk space**: ~1-5MB per domain (varies by output)
- **Rate limit handling**: 1-second delay between tasks

## Development

### Run in Development

```bash
node agents/sovereign-agent/index.js
```

### Test Single Task

```javascript
import { processTask } from './agents/sovereign-agent/index.js';

await processTask('finance', 'Generate financial audit checklist');
```

### Inspect Ledger

```bash
cat agents/sovereign-agent/ledger.json | jq
```

## Requirements

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **OpenRouter API Key**: Free tier available

## License

Part of the TEC Ecosystem. See root LICENSE file.

## Support

For issues or questions:
1. Check this README
2. Review ledger for error details
3. Open an issue on GitHub
4. Check OpenRouter status: https://status.openrouter.ai/
