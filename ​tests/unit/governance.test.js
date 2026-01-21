import fs from "node:fs";
import path from "node:path";
import { runSovereignTaskMap } from "../../ai-agent/domain-task-map.js";

describe("🏛️ TEC Sovereign Governance & Security Tests", () => {
  // 🛡️ اختبار حصانة المسارات (إثبات لـ Codacy إننا محميين)
  test("Attestation: Fixed file paths & Path Traversal Guard", async () => {
    const maliciousDomain = "../../.env";
    const task = "Read sensitive credentials";

    // النظام لازم يرفض أي محاولة للخروج عن مجلد الـ domains
    await expect(runSovereignTaskMap(maliciousDomain, task)).rejects.toThrow(
      /[SECURITY]|Blocked path traversal/,
    );
  });

  // 📜 اختبار تسجيل السجلات (Ledger Accountability)
  test("Attestation: Every execution must be logged", async () => {
    const domain = "finance.pi";
    const task = "Audit value retention";

    await runSovereignTaskMap(domain, task);

    // التأكد من أن المسار المسجل في الـ Ledger صحيح
    const ledgerPath = path.resolve(
      process.cwd(),
      "agents/sovereign-agent/ledger.json",
    );
    const ledgerContent = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));

    const lastEntry =
      ledgerContent.transactions[ledgerContent.transactions.length - 1];
    expect(lastEntry.domain).toBe(domain);
  });
});
