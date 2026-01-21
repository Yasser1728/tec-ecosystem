import path from "path";
import { CONFIG } from "../../index.js";

describe("Sovereign governance constraints", () => {
  test("domains are statically allowlisted", () => {
    const expectedDomains = [
      "tec.pi",
      "finance.pi",
      "market.pi",
      "wallet.pi",
      "commerce.pi",
      "analytics.pi",
      "security.pi",
      "crm.pi",
      "payments.pi",
      "tokens.pi",
      "nft.pi",
      "exchange.pi",
      "staking.pi",
      "governance.pi",
      "insurance.pi",
      "tax.pi",
      "legal.pi",
      "audit.pi",
      "research.pi",
      "marketing.pi",
      "support.pi",
      "hr.pi",
      "devops.pi",
      "infra.pi",
    ];

    expect(CONFIG.domains).toEqual(expectedDomains);
  });

  test("runs in sandbox mode by default", () => {
    expect(CONFIG.sandbox).toBe(true);
  });

  test("services folder is fixed to ai-agent/services", () => {
    const servicesSuffix = path.join("ai-agent", "services");
    expect(CONFIG.servicesFolder.endsWith(servicesSuffix)).toBe(true);
  });
});
