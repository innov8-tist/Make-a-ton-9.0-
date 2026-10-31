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
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log(`User ${email} already exists, skipping...`);
    return existingUser;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      role,
      isActive: true,
    },
  });

  // If it's a customer, create the corresponding Customer record
  if (role === 'CUSTOMER') {
    await prisma.customer.create({
      data: {
        userId: user.id,
        contactName: name,
        email: email,
      },
    });
    console.log(`Created Customer record for ${email}`);
  }

  console.log(`Created ${role} user: ${email}`);
  return user;
}

async function main() {
  console.log('Starting seed...');

  await seedUser('admin@brightloop.com', 'Admin User', 'Admin@123', 'ADMIN');
  await seedUser('staff@brightloop.com', 'Staff User', 'Staff@123', 'STAFF');
  await seedUser('customer@brightloop.com', 'Customer User', 'Customer@123', 'CUSTOMER');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
