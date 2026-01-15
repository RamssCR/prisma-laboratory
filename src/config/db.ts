import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { DATABASE_URL } from './environment';
import { logger } from '#utils/logger';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

/**
 * Inicializa la conexión con la base de datos a través de Prisma Client.
 * Esta función instancia una conexión utilizando el adaptador configurado
 * y registra el resultado de la operación en los logs del sistema.
 * @example
 * // Uso en el punto de entrada de la aplicación (ej. server.ts)
 * await prisma();
 */
export const prisma = () => {
  try {
    new PrismaClient({ adapter }).$connect();
    logger.info('Database connections established');
  } catch (error) {
    logger.error('Error establishing database connection', error);
  }
};
