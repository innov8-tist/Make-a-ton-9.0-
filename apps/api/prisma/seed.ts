import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

async function seedUser(email: string, name: string, password: string, role: 'ADMIN' | 'STAFF' | 'CUSTOMER') {
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      passwordHash: await hashPassword(password),
      role,
      isActive: true,
    },
  });
}

async function main() {
  console.log('Starting seed...');

  await seedUser('admin@brightloop.com', 'Admin User', 'Admin@123', 'ADMIN');
  await seedUser('staff@brightloop.com', 'Staff User', 'Staff@123', 'STAFF');
  await seedUser('customer@brightloop.com', 'Customer User', 'Customer@123', 'CUSTOMER');

  console.log('Created login users for ADMIN, STAFF, and CUSTOMER roles.');
  
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
