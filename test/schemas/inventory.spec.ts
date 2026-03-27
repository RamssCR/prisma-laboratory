import { inventorySchema } from '#schemas/inventory';
import { describe, expect, test } from 'vitest';

describe('Inventory Schema', () => {
  test('debe validar un objeto de inventario válido', () => {
    const validInventory = {
      productId: 1,
      quantity: 10,
      location: 'Almacén A',
      active: true,
    };
    const result = inventorySchema.safeParse(validInventory);
    expect(result.success).toBe(true);
  });
});
