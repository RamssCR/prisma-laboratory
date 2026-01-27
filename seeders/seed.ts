import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: adapter });

const seeder = async () => {
  const brand = await prisma.brand.upsert({
    where: { slug: 'victory' },
    update: {},
    create: {
      name: 'Victory',
      slug: 'victory',
    },
  });
  console.log(brand);
};
seeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
