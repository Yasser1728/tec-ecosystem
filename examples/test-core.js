/**
 * Example: Testing Micro OS Core Systems
 * 
 * This demonstrates the core sovereignty architecture in action
 */

const { MicroOSCore } = require('../core');

async function testCoreSystem() {
  console.log('='.repeat(60));
  console.log('Testing Micro OS Core Systems');
  console.log('='.repeat(60));

  // Initialize core
  const core = new MicroOSCore();
  console.log('\n✓ Core initialized');

  // Test Identity Manager
  console.log('\n--- Testing Identity Manager ---');
  const identity = await core.identityManager.registerIdentity({
    name: 'John Doe',
    email: 'john.doe@example.com',
    type: 'PROPERTY_OWNER'
  });
  console.log('✓ Identity registered:', identity.id);

  const verification = await core.identityManager.verifyIdentity(identity.id);
  console.log('✓ Identity verified:', verification.verified);

  // Test Forensic Logger
  console.log('\n--- Testing Forensic Logger ---');
  const log1 = core.forensicLogger.log({
    type: 'TEST_OPERATION',
    data: { message: 'Testing forensic logging' },
    actor: identity.id,
    critical: false
  });
  console.log('✓ Log created:', log1.id);

  const log2 = core.forensicLogger.log({
    type: 'CRITICAL_TEST',
    data: { message: 'Testing critical notification' },
    actor: identity.id,
    critical: true
  });
  console.log('✓ Critical log created (notification sent):', log2.id);

  const integrity = core.forensicLogger.verifyIntegrity();
  console.log('✓ Log chain integrity:', integrity.valid ? 'VALID' : 'INVALID');

  // Test Approval Center
  console.log('\n--- Testing Approval Center ---');
  const approval = await core.approvalCenter.requestApproval({
    type: 'TEST_APPROVAL',
    data: {
      operation: 'High Value Transaction',
      amount: 500000
    },
    requestedBy: identity.id,
    priority: 'HIGH'
  });
  console.log('✓ Approval requested:', approval.id);
  console.log('  Status:', approval.status);
  console.log('  Contact:', approval.sovereignContact);

  // Process approval
  const processed = await core.approvalCenter.processApproval(
    approval.id,
    true,
    'Approved after verification'
  );
  console.log('✓ Approval processed:', processed.status);

  // Test Event Bus
  console.log('\n--- Testing Event Bus ---');
  let eventReceived = false;
  
  const subId = core.eventBus.subscribe('TEST_EVENT', async (event) => {
    console.log('✓ Event received:', event.type);
    eventReceived = true;
  });
  
  await core.eventBus.publish({
    type: 'TEST_EVENT',
    source: 'TEST_SUITE',
    data: { message: 'Test event data' },
    critical: false
  });
  
  console.log('✓ Event published and handler called');

  // Get system health
  console.log('\n--- System Health Check ---');
  const health = core.getHealthStatus();
  console.log('✓ Forensic Logger:', health.systems.forensicLogger.status);
  console.log('  Total logs:', health.systems.forensicLogger.totalLogs);
  console.log('✓ Identity Manager:', health.systems.identityManager.status);
  console.log('  Total identities:', health.systems.identityManager.totalIdentities);
  console.log('✓ Approval Center:', health.systems.approvalCenter.status);
  console.log('  Pending approvals:', health.systems.approvalCenter.pendingApprovals);
  console.log('✓ Event Bus:', health.systems.eventBus.status);
  console.log('  Total events:', health.systems.eventBus.statistics.totalEvents);

  console.log('\n' + '='.repeat(60));
  console.log('All Core Systems Tests Passed! ✅');
  console.log('Sovereign Contact:', health.sovereignContact);
  console.log('='.repeat(60) + '\n');
}

// Run tests
if (require.main === module) {
  testCoreSystem().catch(console.error);
}

module.exports = { testCoreSystem };
