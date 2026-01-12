# Sovereign AI Agent - Quick Start Guide

## Prerequisites

- Node.js 20.0.0 or higher
- npm 10.0.0 or higher
- OpenRouter API key (get free tier at https://openrouter.ai)

## Installation

The agent is already included in the TEC Ecosystem. No additional installation needed.

## Configuration

1. **Create or edit `.env` file** in the project root:

```bash
cp .env.example .env
```

2. **Add your OpenRouter API key**:

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

3. **Optional configurations**:

```env
# Change paid fallback model (default: openai/gpt-4o-mini)
OR_PAID_MODEL=openai/gpt-4o-mini

# Set HTTP Referer for OpenRouter rankings
OPENROUTER_HTTP_REFERER=https://github.com/Yasser1728/tec-ecosystem

# Set application title
OPENROUTER_APP_TITLE=TEC Sovereign AI Agent
```

## Usage

### Run the Agent

```bash
npm run agent:run
```

### What Happens

The agent will:
1. ✅ Initialize ledger at `agents/sovereign-agent/ledger.json`
2. 🔄 Process 24 domains with 72 total tasks
3. 🆓 Try free models first (Gemini Flash, Llama 3.2, Mistral 7B, etc.)
4. 💰 Fall back to paid model if needed (GPT-4o Mini)
5. 📝 Generate Markdown documentation for each task
6. 💾 Save outputs to `domains/<domain>/<task-slug>.md`
7. 📊 Track all operations in the ledger

### Expected Output

```
🚀 Sovereign AI Agent Starting...

════════════════════════════════════════════════════════════
📊 Processing 24 domains
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

[... more tasks ...]

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

## Output Files

### Generated Documentation

After running, you'll find:

```
domains/
├── tec/
│   ├── generate-ecosystem-overview-documentation.md
│   ├── create-integration-guide-for-new-domains.md
│   └── document-api-standards-and-best-practices.md
├── finance/
│   ├── generate-financial-audit-checklist.md
│   ├── create-transaction-monitoring-guidelines.md
│   └── document-compliance-requirements.md
├── commerce/
│   ├── generate-e-commerce-best-practices-guide.md
│   ├── create-payment-integration-checklist.md
│   └── document-order-fulfillment-workflow.md
└── [... 21 more domains ...]
```

### Ledger

The ledger tracks every operation:

```json
[
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
]
```

## Cost Optimization

### Free-First Strategy

The agent automatically:
1. Tries 6 free models in priority order
2. Only uses paid models if all free models fail
3. Tracks model usage in ledger for cost monitoring

### Expected Costs

- **Best case**: $0.00 (all tasks use free models)
- **Typical case**: $0.10-0.50 (mostly free, occasional paid fallback)
- **Worst case**: $0.72 (all tasks use GPT-4o Mini)

### Free Models Used

1. `google/gemini-flash-1.5-8b` - Fast and efficient
2. `meta-llama/llama-3.2-3b-instruct:free` - Meta's latest
3. `microsoft/phi-3-mini-128k-instruct:free` - Compact model
4. `mistralai/mistral-7b-instruct:free` - Base model
5. `nousresearch/hermes-3-llama-3.1-405b:free` - Large context
6. `qwen/qwen-2-7b-instruct:free` - Multilingual

## Customization

### Add New Tasks

Edit `agents/sovereign-agent/task-map.js`:

```javascript
export const DOMAIN_TASK_MAP = {
  'finance': [
    'Generate financial audit checklist',
    'Create transaction monitoring guidelines',
    'Your new task here'  // Add here
  ]
};
```

### Change Model Priority

Edit `agents/sovereign-agent/openrouter.client.js`:

```javascript
const FREE_MODELS = [
  'your-preferred-model',
  'google/gemini-flash-1.5-8b',
  // ... other models
];
```

### Change Paid Fallback

Set in `.env`:

```env
OR_PAID_MODEL=anthropic/claude-3.5-sonnet
```

## Troubleshooting

### Error: OPENROUTER_API_KEY environment variable is required

**Solution**: Add your API key to `.env` file.

### Error: All models failed

**Causes**:
- Invalid API key
- Rate limit exceeded
- Network issues

**Solutions**:
1. Verify API key is correct
2. Wait 5-10 minutes and retry
3. Check OpenRouter status: https://status.openrouter.ai

### No output files

**Check**:
1. Agent completed successfully (check logs)
2. Ledger shows successful entries
3. File permissions on `domains/` directory

### Ledger corrupted

**Solution**: Delete and recreate:

```bash
echo "[]" > agents/sovereign-agent/ledger.json
```

## Performance

- **Average task**: 1-3 seconds
- **Total runtime**: ~3-5 minutes for 72 tasks
- **Memory usage**: ~50-100MB
- **Disk space**: ~5-10MB total

## Security Best Practices

✅ **Do**:
- Keep `.env` file private
- Use strong API keys
- Review generated content
- Monitor API usage

❌ **Don't**:
- Commit `.env` to git
- Share API keys publicly
- Trust generated content blindly
- Ignore rate limits

## Advanced Usage

### Run Specific Domain

Currently not supported. To add this feature, modify `index.js` to accept command-line arguments.

### Parallel Processing

For faster processing, modify the agent to run domains in parallel. Current implementation is sequential to respect rate limits.

### Custom Output Format

Modify `writeOutput()` function in `index.js` to change output format (JSON, HTML, etc.).

## Support

- Documentation: `agents/sovereign-agent/README.md`
- Repository: https://github.com/Yasser1728/tec-ecosystem
- OpenRouter: https://openrouter.ai/docs

## License

Part of TEC Ecosystem. See root LICENSE file.
