import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { DATABASE_URL } from './environment';
import { logger } from '#utils/logger';

const connectionString = `${DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

export const connectDb = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connections established');
  } catch (error) {
    logger.error('Error establishing database connection', error);
  }
};
