const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Auto-load .env if present and variables not yet in process.env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    // Ignore .env read error
  }
}

async function ensureDatabase() {
  const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!dbUrl) {
    console.log('[ensure-db] No DATABASE_URL found in environment. Skipping database push.');
    return;
  }

  console.log('[ensure-db] Database URL detected. Synchronizing schema to PostgreSQL database...');
  let pushSuccess = false;
  try {
    execSync('npx prisma db push --accept-data-loss --skip-generate', {
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log('[ensure-db] Prisma schema synchronized successfully!');
    pushSuccess = true;
  } catch (err) {
    console.warn('[ensure-db] Warning: prisma db push skipped or unreachable:', err.message);
  }

  if (!pushSuccess) {
    return;
  }

  // Populate default services and starter members if tables are empty
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const servicesCount = await prisma.services.count();
    console.log(`[ensure-db] Current services count in database: ${servicesCount}`);

    if (servicesCount === 0) {
      console.log('[ensure-db] Seeding default gym services...');
      const defaultServices = [
        {
          id: 'srv-001',
          name: 'Annual Premium Membership',
          description: 'Full access to gym floor, cardio equipment, steam bath, and locker facilities for 12 months.',
          price: 15000,
          duration: 12,
        },
        {
          id: 'srv-002',
          name: 'Half-Yearly Fitness Plan',
          description: '6 months access to strength & conditioning floor and general trainer guidance.',
          price: 8500,
          duration: 6,
        },
        {
          id: 'srv-003',
          name: 'Quarterly Regular Plan',
          description: '3 months standard gym membership with personalized workout card.',
          price: 4800,
          duration: 3,
        },
        {
          id: 'srv-004',
          name: 'Monthly Access Pass',
          description: '1 month unlimited gym floor access.',
          price: 2000,
          duration: 1,
        },
        {
          id: 'srv-005',
          name: 'Personal Training (3 Months)',
          description: 'Dedicated certified 1-on-1 personal trainer, custom workout & weekly progress tracking.',
          price: 12000,
          duration: 3,
        },
        {
          id: 'srv-006',
          name: 'Zumba & Aerobics (Monthly)',
          description: 'High-energy group dance workout batch (Mon-Fri evening batches).',
          price: 2500,
          duration: 1,
        },
        {
          id: 'srv-007',
          name: 'Cardio & HIIT Special (Quarterly)',
          description: 'Cross-training, HIIT, rowing, functional battle ropes, and agility drills.',
          price: 5500,
          duration: 3,
        },
        {
          id: 'srv-008',
          name: 'Yoga & Flexibility (Monthly)',
          description: 'Morning guided Hatha & Vinyasa yoga sessions with breathwork.',
          price: 2200,
          duration: 1,
        },
      ];

      for (const s of defaultServices) {
        await prisma.services.upsert({
          where: { id: s.id },
          update: {},
          create: s,
        });
      }
      console.log('[ensure-db] Default services seeded successfully!');
    }

    const memberCount = await prisma.member.count();
    console.log(`[ensure-db] Current members count in database: ${memberCount}`);

    if (memberCount === 0) {
      console.log('[ensure-db] Seeding initial starter members...');
      const starterMembers = [
        {
          id: 'mem-001',
          name: 'Aarav Patel',
          email: 'aarav.patel@gmail.com',
          memberCode: 'MEM0000001',
          phone: BigInt('9820110001'),
          address: 'Andheri West, Mumbai',
          DOB: '15-05-1996',
          gender: 'male',
          DOJ: '15-01-2026',
        },
        {
          id: 'mem-002',
          name: 'Pooja Sharma',
          email: 'pooja.sharma@yahoo.com',
          memberCode: 'MEM0000002',
          phone: BigInt('9820110002'),
          address: 'Bandra, Mumbai',
          DOB: '22-08-1998',
          gender: 'female',
          DOJ: '01-02-2026',
        },
        {
          id: 'mem-025',
          name: 'Ayush Agarwal',
          email: 'ayush.agarwal@gmail.com',
          memberCode: 'MEM0000025',
          phone: BigInt('9820110025'),
          address: 'Viman Nagar, Pune',
          DOB: '12-09-1997',
          gender: 'male',
          DOJ: '10-02-2026',
        },
        {
          id: 'mem-003',
          name: 'Rohan Deshmukh',
          email: 'rohan.d@gmail.com',
          memberCode: 'MEM0000003',
          phone: BigInt('9820110003'),
          address: 'Kothrud, Pune',
          DOB: '05-11-1995',
          gender: 'male',
          DOJ: '20-01-2026',
        },
        {
          id: 'mem-004',
          name: 'Sneha Kulkarni',
          email: 'sneha.k@rediffmail.com',
          memberCode: 'MEM0000004',
          phone: BigInt('9820110004'),
          address: 'Baner, Pune',
          DOB: '18-03-2000',
          gender: 'female',
          DOJ: '01-03-2026',
        },
      ];

      for (const m of starterMembers) {
        await prisma.member.upsert({
          where: { memberCode: m.memberCode },
          update: {},
          create: m,
        });
      }
      console.log('[ensure-db] Starter members seeded successfully!');
    }

    await prisma.$disconnect();
  } catch (err) {
    console.warn('[ensure-db] Database initialization notice:', err.message);
  }
}

ensureDatabase().catch((err) => {
  console.warn('[ensure-db] Notice:', err.message);
});

