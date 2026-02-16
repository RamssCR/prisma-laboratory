import { prisma } from '#config/db';
import { findMany } from './product';
import type { InventorySchema } from '#schemas/inventory';

/**
 * Genera un movimiento de inventario dependiendo del estado dado
 * @param data Informacion de movimiento y estado
 * @returns Resultado de creacion
 * @example
 * await createMovement({"productId": 6, "quantity": 35, "type": "ENTRADA"})
 */
export const createMovement = async (data: InventorySchema) => {
  return await prisma.$transaction(async (tx) => {
    if (data.type === 'VENTA') {
      const aggregate = await tx.inventoryMovement.aggregate({
        where: { productId: data.productId, active: true },
        _sum: { quantity: true },
      });

      const currentStock = aggregate._sum.quantity || 0;
      const requestedAmount = Math.abs(data.quantity);

      if (currentStock < requestedAmount) {
        throw new Error(
          `Stock insuficiente. Disponible: ${currentStock}, Requerido: ${requestedAmount}`,
        );
      }
    }

    return await tx.inventoryMovement.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        type: data.type,
        active: true,
      },
    });
  });
};

/**
 * Consulta todos los productos y su stock dados los filtros
 * @param search Filtros de busqueda
 * @returns Inventario disponible
 * @example
 * await getProductStock("yamaha")
 * // returns - data : [{...}, {...}]
 */
export const getProductStock = async (search?: string) => {
  const products = await findMany(search, true);

  return products.map((product) => {
    const currentStock = product.movements.reduce(
      (acc, mov) => acc + mov.quantity,
      0,
    );

    const { movements: _, ...productData } = product;

    return {
      ...productData,
      stock: currentStock,
    };
  });
};
