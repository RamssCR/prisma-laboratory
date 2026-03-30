import { createProduct } from '#controllers/product';
import { create } from '#services/product';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/product', () => ({
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  softDelete: vi.fn(),
}));

const mockProduct = {
  id: 1,
  sku: 'HON-CB500-BRK',
  name: 'Pastillas de Freno Delanteras Honda CB500',
  price: 125000,
  minStock: 10,
  categoryId: 3,
  brandId: 2,
  createdAt: '2026-02-06T14:22:12.410Z',
  updatedAt: '2026-02-06T14:22:12.410Z',
  active: true,
  slug: 'pastillas-de-freno-delanteras-honda-cb500',
};

describe('Controlador de productos', () => {
  test('debería crear un nuevo producto', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/products',
        body: {
          name: 'Pastillas de Freno Delanteras Honda CB500',
          sku: 'HON-CB500-BRK',
          price: 125000,
          minStock: 10,
          active: true,
          categoryId: 3,
          brandId: 2,
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(create).mockResolvedValue(mockProduct as never);

    await createProduct(req, res, next);

    expect(create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Product created successfully',
      data: mockProduct,
    });
  });

  test('Deberia manejar errores en la creacion de producto', async () => {
    const req = createRequest({
        method: 'POST',
        url: 'api/products',
        body: {
          name: 'Pastillas de Freno Delanteras Honda CB500',
          sku: 'HON-CB500-BRK',
          price: 125000,
          minStock: 10,
          active: true,
          categoryId: 3,
          brandId: 2,
        },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('create error');

    vi.mocked(create).mockRejectedValue(error);

    await createProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
