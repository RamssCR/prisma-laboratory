import { productSchema } from '#schemas/product';
import { describe, expect, test } from 'vitest';

describe('Product Schema', () => {
  test('debe validar un producto válido', () => {
    const validProduct = {
      name: 'Producto de ejemplo',
      sku: 'SKU12345',
      price: 100,
      minStock: 10,
      active: true,
      categoryId: 1,
      brandId: 1,
    };
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });
});
