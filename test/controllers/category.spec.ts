import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '#controllers/category';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/category';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/category', () => ({
  create: vi.fn(),
  createMany: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
}));

const mockCategory = {
  id: 1,
  name: 'Aceite',
  slug: 'aceite',
  active: true,
  createdAt: '2026-01-27T14:17:07.954Z',
  updatedAt: '2026-01-27T14:17:07.954Z',
};

describe('Controlador de categorías', () => {
  test('Debe crear una nueva categoria', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/categories',
        body: { name: 'Aceite' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(create).mockResolvedValue(mockCategory as never);

    await createCategory(req, res, next);

    expect(create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Category created successfully',
      data: mockCategory,
    });
  });

  test('Debe manejar errores al crear una categoria', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/categories',
        body: { name: 'Aceite' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('create error');

    vi.mocked(create).mockRejectedValue(error);

    await createCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe actualizar una categoria', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/categories/1',
        params: { id: '1' },
        body: { name: 'Kit Arrastre' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(update).mockResolvedValue({
      ...mockCategory,
      name: 'Kit Arrastre',
    } as never);

    await updateCategory(req, res, next);

    expect(update).toHaveBeenCalledWith(1, req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Category updated successfully',
      data: { ...mockCategory, name: 'Kit Arrastre' },
    });
  });

  test('Debe manejar errores al actualizar una categoria', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/categories/1',
        params: { id: '1' },
        body: { name: 'Kit Arrastre' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('update error');

    vi.mocked(update).mockRejectedValue(error);

    await updateCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe devolver todas las categorias', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/categories',
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findMany).mockResolvedValue([mockCategory] as never);

    await getCategories(req, res, next);

    expect(findMany).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Categories obtained successfully',
      data: [mockCategory],
    });
  });

  test('Debe manejar errores al obtener las categorias', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/categories',
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findMany error');

    vi.mocked(findMany).mockRejectedValue(error);

    await getCategories(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe devolver una categoria por su id', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/categories/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findUnique).mockResolvedValue(mockCategory as never);

    await getCategoryById(req, res, next);

    expect(findUnique).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Category obtained successfully',
      data: mockCategory,
    });
  });

  test('Debe manejar errores al obtener una categoria por su id', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/categories/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findUnique error');

    vi.mocked(findUnique).mockRejectedValue(error);

    await getCategoryById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('Debe eliminar una categoria', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/categories/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(softDelete).mockResolvedValue(undefined as never);

    await deleteCategory(req, res, next);

    expect(softDelete).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Category deleted successfully',
    });
  });

  test('Debe manejar errores al eliminar una categoria', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/categories/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('softDelete error');

    vi.mocked(softDelete).mockRejectedValue(error);

    await deleteCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
