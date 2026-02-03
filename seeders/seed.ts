import brandJson from './brands.json' with { type: 'json' };
import categoryJson from './categories.json' with { type: 'json' };
import { createMany as category } from '#services/category';
import { createMany as brand } from '#services/brand';
import { prisma } from '#config/db';

/**
 * Bloque de ejecución principal del seeding de base de datos.
 * Este script realiza las siguientes operaciones:
 * - Limpia las tablas `brand` y `category` mediante `deleteMany()`
 * - Pobla las tablas con datos desde archivos JSON importados
 * @async
 * @throws Termina el proceso con código 1 si ocurre un error
 */
try {
  console.log('Iniciando seeding');
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  await brand(brandJson);
  await category(categoryJson);
  console.log('Seeding ejecutado exitosamente');
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
