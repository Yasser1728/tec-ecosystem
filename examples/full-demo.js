/**
 * Complete Integration Example
 * 
 * Demonstrates full workflow:
 * 1. Initialize Micro OS Core
 * 2. Create identities
 * 3. Register properties with forensic deeds
 * 4. Transfer ownership with approvals
 * 5. Monitor system health
 */

const { MicroOSCore } = require('../core');
const EstateApp = require('../apps/estate');

async function runFullDemo() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║        Micro OS - Full Integration Demonstration          ║');
  console.log('║                                                           ║');
  console.log('║  Sovereign Software Architecture for Secure Micro-Apps   ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log('Sovereign Contact: yasserrr.fox17@gmail.com');
  console.log('Architecture: Monorepo with Core + Micro-Apps');
  console.log('\n');

  // Phase 1: System Initialization
  console.log('━━━ PHASE 1: System Initialization ━━━\n');
  
  const core = new MicroOSCore();
  console.log('✓ Core systems initialized');
  console.log('  - Identity Manager');
  console.log('  - Forensic Logger');
  console.log('  - Approval Center');
  console.log('  - Event Bus');

  const estateApp = new EstateApp(core);
  console.log('✓ Estate Micro-App initialized');

  // Phase 2: Identity Creation
  console.log('\n━━━ PHASE 2: Identity Management ━━━\n');
  
  const seller = await core.identityManager.registerIdentity({
    name: 'Ahmed Al-Maktoum',
    email: 'ahmed@example.ae',
    type: 'PROPERTY_OWNER',
    nationality: 'UAE'
  });
  console.log('✓ Seller identity created:', seller.id);

  const buyer = await core.identityManager.registerIdentity({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    type: 'PROPERTY_BUYER',
    nationality: 'UK'
  });
  console.log('✓ Buyer identity created:', buyer.id);

  // Phase 3: Property Registration
  console.log('\n━━━ PHASE 3: Property Registration ━━━\n');
  
  const property = await estateApp.getService().registerProperty({
    propertyId: 'PROP-DXB-MARINA-2024-001',
    propertyType: 'LUXURY_APARTMENT',
    location: 'Dubai Marina, Marina 101 Tower, Floor 85, Unit 8501',
    size: 3500,
    bedrooms: 4,
    bathrooms: 5,
    amenities: ['Pool', 'Gym', 'Concierge', 'Private Parking'],
    value: 3500000
  }, seller.id);

  console.log('✓ Property registered');
  console.log('  Deed ID:', property.deed.id);
  console.log('  Property:', property.deed.propertyId);
  console.log('  Location:', property.deed.location);
  console.log('  Size:', property.deed.size, 'sq ft');
  console.log('  Value: $', property.deed.value.toLocaleString());
  console.log('  Approval:', property.approval.id, '(PENDING)');
  console.log('  → Notification sent to:', property.deed.sovereignContact);

  // Approve registration
  await core.approvalCenter.processApproval(
    property.approval.id,
    true,
    'Property registration approved. All documents verified and authenticated.'
  );
  console.log('✓ Registration APPROVED by sovereign authority');

  // Phase 4: Ownership Transfer
  console.log('\n━━━ PHASE 4: Ownership Transfer ━━━\n');
  
  const transfer = await estateApp.getService().initiateTransfer(
    property.deed.id,
    seller.id,
    buyer.id
  );

  console.log('✓ Transfer initiated');
  console.log('  From:', seller.name);
  console.log('  To:', buyer.name);
  console.log('  Approval:', transfer.approvalId, '(PENDING)');
  console.log('  → Notification sent to:', 'yasserrr.fox17@gmail.com');

  // Wait for approval (simulated)
  console.log('\n⏳ Awaiting sovereign approval...');
  
  const transferApproval = await estateApp.getService().processTransferApproval(
    property.deed.id,
    transfer.approvalId,
    true,
    'Transfer approved. Payment verified: $3,500,000. Documents signed and notarized.'
  );

  console.log('✓ Transfer APPROVED and EXECUTED');
  console.log('  New owner:', transferApproval.deed.ownerId);
  console.log('  Transfer date:', transferApproval.deed.lastTransferDate);

  // Phase 5: Forensic Verification
  console.log('\n━━━ PHASE 5: Forensic Verification ━━━\n');
  
  const details = await estateApp.getService().getPropertyDetails(property.deed.id);
  
  console.log('✓ Property Details:');
  console.log('  Status:', details.deed.status);
  console.log('  Current Owner:', details.deed.ownerId);
  console.log('  Transfer History:', details.deed.transferHistory.length, 'transfers');
  
  console.log('\n✓ Forensic Trail:');
  details.deed.forensicTrail.forEach((entry, i) => {
    console.log(`  ${i + 1}. ${entry.action} at ${entry.timestamp}`);
  });

  console.log('\n✓ System Logs:', details.systemLogs.length, 'entries');
  
  const verification = await estateApp.getService().estateService.forensicDeed.verifyDeed(
    property.deed.id
  );
  console.log('\n✓ Authenticity Verification:');
  console.log('  Valid:', verification.valid ? '✅ YES' : '❌ NO');
  console.log('  Verified by:', verification.verifiedBy);
  console.log('  Verified at:', verification.verifiedAt);

  // Phase 6: System Health & Statistics
  console.log('\n━━━ PHASE 6: System Health & Statistics ━━━\n');
  
  const health = core.getHealthStatus();
  console.log('✓ System Health:');
  console.log('  Forensic Logger:', health.systems.forensicLogger.status);
  console.log('    - Total logs:', health.systems.forensicLogger.totalLogs);
  console.log('    - Integrity:', health.systems.forensicLogger.integrity.message);
  console.log('  Identity Manager:', health.systems.identityManager.status);
  console.log('    - Total identities:', health.systems.identityManager.totalIdentities);
  console.log('  Approval Center:', health.systems.approvalCenter.status);
  console.log('    - Pending approvals:', health.systems.approvalCenter.pendingApprovals);
  console.log('  Event Bus:', health.systems.eventBus.status);
  console.log('    - Total events:', health.systems.eventBus.statistics.totalEvents);

  const stats = estateApp.getService().getStatistics();
  console.log('\n✓ Estate App Statistics:');
  console.log('  Total deeds:', stats.totalDeeds);
  console.log('  Active deeds:', stats.activeDeeds);
  console.log('  Revoked deeds:', stats.revokedDeeds);
  console.log('  Pending approvals:', stats.pendingApprovals);

  // Final Summary
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║               ✅ DEMONSTRATION COMPLETE                   ║');
  console.log('║                                                           ║');
  console.log('║  All operations logged with forensic integrity            ║');
  console.log('║  All critical decisions approved by sovereign authority   ║');
  console.log('║  All notifications sent to yasserrr.fox17@gmail.com      ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log('For more information, see MICRO_OS_README.md');
  console.log('\n');
}

// Run demonstration
if (require.main === module) {
  runFullDemo().catch(console.error);
}

module.exports = { runFullDemo };
