import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { DATABASE_URL } from './environment';
import { logger } from '#utils/logger';

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

/**
 * Instancia global (Singleton) del cliente de Prisma.
 * Utiliza esta instancia para realizar todas las operaciones CRUD.
 */
export const prisma = new PrismaClient({ adapter });

/**
 * Inicializa la conexión con la base de datos a través de Prisma Client.
 * Esta función instancia una conexión utilizando el adaptador configurado
 * y registra el resultado de la operación en los logs del sistema.
 * @example
 * // Uso en el punto de entrada de la aplicación (ej. app.ts)
 * await connectDb();
 */
export const connectDb = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connections established');
  } catch (error) {
    logger.error('Error establishing database connection', error);
  }
};
