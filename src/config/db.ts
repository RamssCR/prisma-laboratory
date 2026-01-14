import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { DATABASE_URL } from './environment';
import { logger } from '#utils/logger';

const connectionString = `${DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = () => {
  try {
    new PrismaClient({ adapter }).$connect();
    logger.info('Database connections established');
  } catch (error) {
    logger.error('Error establishing database connection', error);
  }
};
