/**
 * Example: Testing Estate Micro-App
 * 
 * This demonstrates the Estate app with property ownership and transfers
 */

const { MicroOSCore } = require('../core');
const EstateApp = require('../apps/estate');

async function testEstateApp() {
  console.log('='.repeat(60));
  console.log('Testing Estate Micro-App');
  console.log('='.repeat(60));

  // Initialize core and app
  const core = new MicroOSCore();
  const estateApp = new EstateApp(core);
  const estateService = estateApp.getService();

  console.log('\n✓ Core and Estate App initialized');
  console.log('App Info:', estateApp.getInfo().name);

  // Create owner identities
  console.log('\n--- Creating Owner Identities ---');
  const owner1 = await core.identityManager.registerIdentity({
    name: 'Alice Smith',
    email: 'alice@example.com',
    type: 'PROPERTY_OWNER'
  });
  console.log('✓ Owner 1 registered:', owner1.id);

  const owner2 = await core.identityManager.registerIdentity({
    name: 'Bob Johnson',
    email: 'bob@example.com',
    type: 'PROPERTY_BUYER'
  });
  console.log('✓ Owner 2 registered:', owner2.id);

  // Register a property
  console.log('\n--- Registering Property ---');
  const registration = await estateService.registerProperty({
    propertyId: 'PROP-DUBAI-001',
    propertyType: 'RESIDENTIAL',
    location: 'Dubai Marina, Tower A, Floor 35',
    size: 2500,
    value: 1500000
  }, owner1.id);

  console.log('✓ Property registered:', registration.deed.id);
  console.log('  Property ID:', registration.deed.propertyId);
  console.log('  Location:', registration.deed.location);
  console.log('  Value: $', registration.deed.value.toLocaleString());
  console.log('  Owner:', registration.deed.ownerId);
  console.log('  Approval ID:', registration.approval.id);
  console.log('  Status:', registration.approval.status);

  // Approve registration
  console.log('\n--- Processing Registration Approval ---');
  await core.approvalCenter.processApproval(
    registration.approval.id,
    true,
    'Property documents verified and approved'
  );
  console.log('✓ Registration approved');

  // Initiate ownership transfer
  console.log('\n--- Initiating Ownership Transfer ---');
  const transfer = await estateService.initiateTransfer(
    registration.deed.id,
    owner1.id,
    owner2.id
  );

  console.log('✓ Transfer initiated:', transfer.approvalId);
  console.log('  Status:', transfer.status);
  console.log('  Message:', transfer.message);

  // Get property details before transfer
  console.log('\n--- Property Details (Before Transfer) ---');
  let details = await estateService.getPropertyDetails(registration.deed.id);
  console.log('✓ Current owner:', details.deed.ownerId);
  console.log('  Transfer history:', details.deed.transferHistory.length, 'transfers');
  console.log('  Forensic trail:', details.deed.forensicTrail.length, 'entries');

  // Process transfer approval
  console.log('\n--- Processing Transfer Approval ---');
  const transferResult = await estateService.processTransferApproval(
    registration.deed.id,
    transfer.approvalId,
    true,
    'Transfer approved after payment verification and document review'
  );

  console.log('✓ Transfer approved and executed');
  console.log('  Success:', transferResult.success);
  console.log('  New owner:', transferResult.deed.ownerId);

  // Get property details after transfer
  console.log('\n--- Property Details (After Transfer) ---');
  details = await estateService.getPropertyDetails(registration.deed.id);
  console.log('✓ Current owner:', details.deed.ownerId);
  console.log('  Transfer history:', details.deed.transferHistory.length, 'transfers');
  console.log('  Last transfer:', details.deed.transferHistory[0]);
  console.log('  Forensic trail:', details.deed.forensicTrail.length, 'entries');

  // Verify deed
  console.log('\n--- Verifying Deed Authenticity ---');
  const verification = await estateService.estateService.forensicDeed.verifyDeed(
    registration.deed.id
  );
  console.log('✓ Deed valid:', verification.valid);
  console.log('  Status:', verification.status);
  console.log('  Current owner:', verification.ownerId);
  console.log('  Forensic entries:', verification.forensicTrailCount);

  // Get owner properties
  console.log('\n--- Owner Properties ---');
  const owner1Props = await estateService.getOwnerProperties(owner1.id);
  console.log('✓ Owner 1 properties:', owner1Props.totalProperties);
  console.log('  Total value: $', owner1Props.totalValue.toLocaleString());

  const owner2Props = await estateService.getOwnerProperties(owner2.id);
  console.log('✓ Owner 2 properties:', owner2Props.totalProperties);
  console.log('  Total value: $', owner2Props.totalValue.toLocaleString());

  // Get statistics
  console.log('\n--- Estate App Statistics ---');
  const stats = estateService.getStatistics();
  console.log('✓ Total deeds:', stats.totalDeeds);
  console.log('  Active deeds:', stats.activeDeeds);
  console.log('  Revoked deeds:', stats.revokedDeeds);
  console.log('  Pending approvals:', stats.pendingApprovals);
  console.log('  Sovereign contact:', stats.sovereignContact);

  // Health check
  console.log('\n--- App Health Check ---');
  const health = estateApp.healthCheck();
  console.log('✓ Status:', health.status);
  console.log('  Version:', health.version);
  console.log('  Total deeds:', health.service.totalDeeds);

  console.log('\n' + '='.repeat(60));
  console.log('All Estate App Tests Passed! ✅');
  console.log('Sovereign Contact: yasserrr.fox17@gmail.com');
  console.log('='.repeat(60) + '\n');
}

// Run tests
if (require.main === module) {
  testEstateApp().catch(console.error);
}

module.exports = { testEstateApp };
