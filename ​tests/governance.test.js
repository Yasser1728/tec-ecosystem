import fs from 'node:fs';
import path from 'node:path';
import { runSovereignTaskMap } from '../ai-agent/domain-task-map.js';

describe('🏛️ TEC Sovereign Governance & Security Tests', () => {
  
  // 🛡️ اختبار حصانة المسارات (Path Traversal Protection)
  test('Attestation: Fixed file paths & Path Traversal Guard', async () => {
    // محاولة اختراق وهمية للوصول لملف الحساسات خارج مجلد الدومينات
    const maliciousDomain = '../../.env'; 
    const task = 'Read sensitive credentials';
    
    // النظام لازم يرمي Error أمني ويمنع التشغيل
    await expect(runSovereignTaskMap(maliciousDomain, task))
      .rejects.toThrow(/[SECURITY]|Blocked path traversal/);
  });

  // 📜 اختبار الامتثال للسجلات (Ledger Accountability)
  test('Attestation: Every execution must be logged', async () => {
    const domain = 'finance.pi';
    const task = 'Test value retention logging';
    
    // تنفيذ مهمة تجريبية
    await runSovereignTaskMap(domain, task);
    
    // تحديد مسار الـ Ledger بناءً على هيكل المشروع
    const ledgerPath = path.resolve(process.cwd(), 'agents/sovereign-agent/ledger.json');
    const ledgerContent = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    
    // التأكد إن العملية تم تسجيلها بنجاح
    const lastEntry = ledgerContent.transactions[ledgerContent.transactions.length - 1];
    expect(lastEntry.domain).toBe(domain);
    expect(lastEntry).toHaveProperty('timestamp');
  });

  // 🔒 اختبار الموديلات المصرح بها فقط
  test('Attestation: Only approved patterns in task map', () => {
    const taskMapPath = path.resolve(process.cwd(), 'ai-agent/domain-task-map.js');
    const taskMapSource = fs.readFileSync(taskMapPath, 'utf8');
    
    // التأكد من عدم وجود استدعاءات برمجية خطيرة (eval)
    expect(taskMapSource).not.toMatch(/eval\(/);
    expect(taskMapSource).not.toMatch(/new Function\(/);
  });
});
