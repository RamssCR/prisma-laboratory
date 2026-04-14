import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from '#controllers/brand';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/brand';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/brand', () => ({
  create: vi.fn(),
  createMany: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
}));

const mockBrand = {
  id: 1,
  name: 'Yamaha',
  slug: 'yamaha',
  active: true,
  createdAt: '2026-01-27T14:17:07.954Z',
  updatedAt: '2026-01-27T14:17:07.954Z',
};

describe('Controlador de marcas', () => {
  test('debería crear una nueva marca', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/brands',
        body: {
          name: 'Yamaha',
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(create).mockResolvedValue(mockBrand as never);

    await createBrand(req, res, next);

    expect(create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Brand created successfully',
      data: mockBrand,
    });
  });

  test('debería manejar errores al crear una marca', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/api/brands',
      body: { name: 'Yamaha' },
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('create failed');

    vi.mocked(create).mockRejectedValue(error as never);

    await createBrand(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia retornar todos los vehiculos', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/brands',
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findMany).mockResolvedValue([mockBrand] as never);

    await getBrands(req, res, next);

    expect(findMany).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('debería manejar errores al obtener las marcas', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/brands',
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findMany failed');

    vi.mocked(findMany).mockRejectedValue(error as never);

    await getBrands(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia actualizar una marca', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/brands/1',
        params: { id: '1' },
        body: { name: 'Suzuki' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(update).mockResolvedValue({
      ...mockBrand,
      name: 'Suzuki',
    } as never);

    await updateBrand(req, res, next);

    expect(update).toHaveBeenCalledWith(1, req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Brand updated successfully',
      data: { ...mockBrand, name: 'Suzuki' },
    });
  });

  test('debería manejar errores al actualizar una marca', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/brands/1',
        params: { id: '1' },
        body: { name: 'Suzuki' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('update failed');

    vi.mocked(update).mockRejectedValue(error);

    await updateBrand(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia retornar una marca por id', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/brands/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findUnique).mockResolvedValue(mockBrand as never);

    await getBrandById(req, res, next);

    expect(findUnique).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Brand obtained successfully',
      data: mockBrand,
    });
  });

  test('debería manejar errores al obtener una marca por id', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/brands/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('get error');

    vi.mocked(findUnique).mockRejectedValue(error);

    await getBrandById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia eliminar una marca por id', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/brands/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(softDelete).mockResolvedValue(undefined as never);

    await deleteBrand(req, res, next);

    expect(softDelete).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Brand deleted successfully',
    });
  });

  test('debería manejar errores al eliminar una marca', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/brands/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('delete error');

    vi.mocked(softDelete).mockRejectedValue(error);

    await deleteBrand(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
