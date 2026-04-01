import { movement, stock } from '#controllers/inventory';
import { createMovement, getProductStock } from '#services/inventory';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/inventory', () => ({
  createMovement: vi.fn(),
  getProductStock: vi.fn(),
}));

const mockMovement = {
  id: 7,
  productId: 6,
  quantity: 35,
  type: 'ENTRADA',
  createdAt: '2026-02-11T17:27:46.620Z',
  updatedAt: '2026-02-11T17:27:46.620Z',
  active: true,
};

const mockStock = [
  {
    id: 6,
    sku: 'NGK-SUZ-CR9EIX',
    name: 'Bujía de Iridium CR9EIX',
    price: 65000,
    minStock: 20,
    categoryId: 14,
    brandId: 4,
    createdAt: '2026-02-10T13:07:09.249Z',
    updatedAt: '2026-02-10T13:07:09.249Z',
    active: true,
    slug: 'bujia-de-iridium-cr9eix',
    brand: {
      name: 'Suzuki',
    },
    category: {
      name: 'Encendido y Bujías',
    },
    stock: 70,
  },
];

describe('Controllers inventory', () => {
  test('Deberia crear un inventario correctamente', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/inventory',
        body: {
          productId: 6,
          quantity: 35,
          type: 'ENTRADA',
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(createMovement).mockResolvedValue(mockMovement as never);

    await movement(req, res, next);

    expect(createMovement).toHaveBeenCalledWith({
      productId: 6,
      quantity: 35,
      type: 'ENTRADA',
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Movement created successfully',
      data: mockMovement,
    });
  });

  test('Deberia manejar errores al crear un movimiento', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/inventory',
        body: {
          productId: 6,
          quantity: 35,
          type: 'ENTRADA',
        },
      }),
      res = createResponse(),
      next = vi.fn();
    const error = new Error('Error al crear movimiento');

    vi.mocked(createMovement).mockRejectedValue(error);
    await movement(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Deberia devolver el stock de los productos', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/inventory',
        query: { search: 'ns200' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(getProductStock).mockResolvedValue(mockStock as never);

    await stock(req, res, next);

    expect(getProductStock).toHaveBeenCalledWith('ns200');
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Actual stock loaded',
      data: mockStock,
    });
  });

  test('Deberia manejar errores al consultar el stock', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/inventory',
        query: { search: 'ns200' },
      }),
      res = createResponse(),
      next = vi.fn();
    const error = new Error('Error al consultar stock');

    vi.mocked(getProductStock).mockRejectedValue(error);
    await stock(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
