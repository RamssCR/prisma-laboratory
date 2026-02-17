import { prisma } from '#config/db';
import type { CompatibilitySchema } from '#schemas/compatibility';

/**
 * Crea la compatibilidad entre productos y vehiculos
 *
 * Divide la informacion entre la cantidad de ids de vehiculos y
 * Crea masivamente los registros generados
 * @param param Informacion de creacion
 * @returns Cantidad de registros creados
 * @example
 * await create({"productId": 6, "vehicleId": [1, 2], "notes": "Compatibilidad alta" })
 */
export const create = async ({
  productId,
  vehicleId,
  notes,
}: CompatibilitySchema) => {
  const dataToInsert = vehicleId.map((vId) => ({
    productId: productId,
    vehicleId: vId,
    notes: notes || 'Compatibilidad estándar',
    active: true,
  }));

  return await prisma.productCompability.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });
};
