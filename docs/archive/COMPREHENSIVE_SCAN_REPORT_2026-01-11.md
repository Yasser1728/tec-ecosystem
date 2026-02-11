# Comprehensive Scan Report - 2026-01-11

## Commands Executed

- `npm ci`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm audit --json`

## Results Summary

- **Lint**: Passed (`next lint` reported no warnings or errors).
- **Tests**: Failed.
  - `tests/e2e/quickstart-workflow.test.js`: `ReferenceError: TextEncoder is not defined` (triggered via `supertest`/`formidable` stack).
  - `tests/integration/quickstart-service.test.js`: `INSURANCE_THRESHOLD` and `MIN_INVESTMENT` are undefined in the test scope.
- **Build**: Succeeded with warnings about unsupported App Router i18n config and missing SWC binaries noted in the lockfile.
- **Security (npm audit)**: 1 high-severity vulnerability.
  - `preact` (transitive) — GHSA-36hm-qxxp-pg3m, range `10.28.0 - 10.28.1`; fix available by upgrading to `>=10.28.2`.

## Recommended Follow-ups

1. Provide a `TextEncoder` polyfill in Jest for E2E tests using `supertest`:
   - Verify Jest runs on Node 18+ where `TextEncoder` is available globally (Node 16-17 may still need a polyfill depending on runtime flags).
   - If the runtime still lacks `TextEncoder`, add in `setupFilesAfterEnv`: `const { TextEncoder } = require('util'); global.TextEncoder = TextEncoder;` (or the ESM equivalent).
2. Ensure insurance constants are defined/imported in `tests/integration/quickstart-service.test.js`:
   - Import from the owning service/config module if available, or
   - Define `INSURANCE_THRESHOLD` and `MIN_INVESTMENT` alongside the tests to match business rules.
3. Bump transitive `preact` to `>=10.28.2` (lockfile currently resolves `10.28.1`, vulnerable per [GHSA-36hm-qxxp-pg3m](https://github.com/advisories/GHSA-36hm-qxxp-pg3m)):
   - Add an `overrides` entry in `package.json` (npm) to force `preact@^10.28.2`.
   - If using Yarn, add a `resolutions` entry to the same effect.
   - Alternatively, upgrade the upstream dependency that pulls `preact` to a fixed version.
4. Re-run Jest and audit after applying fixes to confirm a clean scan.
