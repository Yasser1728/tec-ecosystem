const { PrismaClient } = require('@prisma/client');
const { businessUnits } = require('../lib/businessUnits');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Seed Business Units
  console.log('📦 Seeding Business Units...');
  
  for (const [key, unit] of Object.entries(businessUnits)) {
    console.log(`  → Creating ${unit.displayName}...`);
    
    await prisma.businessUnit.upsert({
      where: { key },
      update: {
        name: unit.name,
        displayName: unit.displayName,
        icon: unit.icon,
        tagline: unit.tagline,
        description: unit.description,
        color: unit.color,
      },
      create: {
        key,
        name: unit.name,
        displayName: unit.displayName,
        icon: unit.icon,
        tagline: unit.tagline,
        description: unit.description,
        color: unit.color,
        status: 'ACTIVE',
        pages: {
          create: unit.pages?.map(page => ({
            path: page.path,
            title: page.title,
            description: page.description || '',
          })) || [],
        },
        features: {
          create: unit.features?.map((feature, index) => ({
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
            order: index,
          })) || [],
        },
      },
    });
  }

  console.log(`✅ Created ${Object.keys(businessUnits).length} Business Units\n`);

  // Create demo admin user
  console.log('👤 Creating demo admin user...');
  
  const adminUser = await prisma.user.upsert({
    where: { piId: 'admin-demo-pi-id' },
    update: {},
    create: {
      piId: 'admin-demo-pi-id',
      username: 'admin',
      email: 'admin@tec-ecosystem.com',
      tier: 'ADMIN',
      status: 'ACTIVE',
      language: 'en',
    },
  });

  console.log(`✅ Created admin user: ${adminUser.username}\n`);

  // Create demo standard user
  console.log('👤 Creating demo standard user...');
  
  const standardUser = await prisma.user.upsert({
    where: { piId: 'user-demo-pi-id' },
    update: {},
    create: {
      piId: 'user-demo-pi-id',
      username: 'demo_user',
      email: 'user@tec-ecosystem.com',
      tier: 'STANDARD',
      status: 'ACTIVE',
      language: 'en',
    },
  });

  console.log(`✅ Created standard user: ${standardUser.username}\n`);

  // Create demo premium user
  console.log('👤 Creating demo premium user...');
  
  const premiumUser = await prisma.user.upsert({
    where: { piId: 'premium-demo-pi-id' },
    update: {},
    create: {
      piId: 'premium-demo-pi-id',
      username: 'premium_user',
      email: 'premium@tec-ecosystem.com',
      tier: 'PREMIUM',
      status: 'ACTIVE',
      language: 'en',
    },
  });

  console.log(`✅ Created premium user: ${premiumUser.username}\n`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
