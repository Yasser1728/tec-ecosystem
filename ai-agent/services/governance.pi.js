export async function runDomainService(taskPrompt) {
    console.log('[SANDBOX] Running service for governance.pi');
    return { ok: true, content: taskPrompt, usage: { total_tokens: 0 }, meta: { domain: "governance.pi", sandbox: true, role: "PRIMARY" } };
}