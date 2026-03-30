import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '#controllers/product';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/product';
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

  test('Deberia retornar todos los productos', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/products',
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findMany).mockResolvedValue([mockProduct] as never);
    await getProducts(req, res, next);

    expect(findMany).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Products retrieved successfully',
      data: [mockProduct],
    });
  });

  test('Deberia manejar errores al obtener los productos', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/products',
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findMany error');

    vi.mocked(findMany).mockRejectedValue(error);

    await getProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia retornar un producto por su id', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/products/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findUnique).mockResolvedValue(mockProduct as never);

    await getProduct(req, res, next);

    expect(findUnique).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Product obtained successfully',
      data: mockProduct,
    });
  });

  test('Deberia manejar errores al obtener un producto por su id', async () => {
    const req = createRequest({
        method: 'GET',
        url: 'api/products/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findUnique error');

    vi.mocked(findUnique).mockRejectedValue(error);

    await getProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia actualizar un producto por su id', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: 'api/products/1',
        params: { id: '1' },
        body: { price: 130000 },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(update).mockResolvedValue({
      ...mockProduct,
      price: 130000,
    } as never);

    await updateProduct(req, res, next);

    expect(update).toHaveBeenCalledWith(1, req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Product updated successfully',
      data: { ...mockProduct, price: 130000 },
    });
  });

  test('Deberia manejar errores al actualizar un producto por su id', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: 'api/products/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('update error');

    vi.mocked(update).mockRejectedValue(error);

    await updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia eliminar un producto por su id', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: 'api/products/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(softDelete).mockResolvedValue(undefined as never);

    await deleteProduct(req, res, next);

    expect(softDelete).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Product deleted successfully',
    });
  });

  test('Deberia manejar errores al eliminar un producto por su id', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: 'api/products/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('softDelete error');

    vi.mocked(softDelete).mockRejectedValue(error);

    await deleteProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
