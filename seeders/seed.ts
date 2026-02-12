import brandJson from './brands.json' with { type: 'json' };
import categoryJson from './categories.json' with { type: 'json' };
import productJson from './products.json' with { type: 'json' };
import userJson from './users.json' with { type: 'json' };
import vehicleJson from './vehicle.json' with { type: 'json' };
import { createMany as category } from '#services/category';
import { createMany as brand } from '#services/brand';
import { createMany as product } from '#services/product';
import { createMany as vehicle } from '#services/vehicle';
import { create as user } from '#services/user';
import { prisma } from '#config/db';
import type { UserSchema } from '#schemas/user';
import type { VehicleSchema } from '#schemas/vehicle';

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
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vehicle.deleteMany();

  await brand(brandJson);
  await category(categoryJson);
  await product(productJson);
  await user(userJson as UserSchema);
  await vehicle(vehicleJson as VehicleSchema[]);
  console.log('Seeding ejecutado exitosamente');
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
