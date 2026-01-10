export async function runDomainService(domain, prompt) {
  console.log('🟢 Running sandbox service for', domain);
  return { success: true, message: 'Sandbox mode', prompt };
}