// baseService.js - Service Template for Sovereign OS 2026
import { executeModel } from '../core/openrouter.js';
import { councilDecision, TASK_TYPES } from '../core/council.js';
import { recordTransaction, getCostSignal } from '../core/ledger.js';

/**
 * @param {string} domain - اسم الدومين
 * @param {string} taskPrompt - المهمة المطلوب تنفيذها
 * @returns {Promise<{ok: boolean, content: string, usage: object}>}
 */
export async function runDomainService(domain, taskPrompt) {
    console.log(`\n🔹 Running service for domain: ${domain}`);

    const decision = councilDecision({
        taskType: TASK_TYPES.DEVELOPMENT,
        domain,
        requiresAudit: true
    });

    try {
        const result = await executeModel({
            model: decision.primary,
            messages: [{ role: 'user', content: taskPrompt }],
            domain
        });

        if (!result.ok) throw new Error('Primary model execution failed');

        recordTransaction({
            model: decision.primary,
            usage: result.usage,
            domain,
            role: 'PRIMARY'
        });

        if (decision.auditor) {
            const auditResult = await executeModel({
                model: decision.auditor,
                messages: [
                    { role: 'system', content: 'Audit this code for security & best practices' },
                    { role: 'user', content: result.content }
                ],
                domain,
                role: 'AUDITOR'
            });

            recordTransaction({
                model: decision.auditor,
                usage: auditResult.usage,
                domain,
                role: 'AUDITOR'
            });

            console.log(`✅ Audit completed for domain: ${domain}`);
        }

        if (getCostSignal().isLowBalance) {
            console.warn(`⚠️ Budget threshold reached for ${domain}. Switching to reserve mode.`);
        }

        return result;

    } catch (err) {
        console.error(`💥 Service failed for domain ${domain}:`, err.message);
        return { ok: false, content: '', usage: {} };
    }
}
