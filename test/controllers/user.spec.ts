import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '#controllers/user';
import { create, findMany, softDelete, update } from '#services/user';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/user', () => ({
  create: vi.fn(),
  update: vi.fn(),
  findByEmail: vi.fn(),
  findMany: vi.fn(),
  softDelete: vi.fn(),
}));

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  active: true,
  role: 'USER',
};

describe('Controlador de usuarios', () => {
  test('debería crear un nuevo usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashedpassword',
        },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(create).mockResolvedValue(mockUser as never);

    await createUser(req, res, next);

    expect(create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'User created successfully',
      data: mockUser,
    });
  });

  test('debería manejar errores al crear un usuario', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashedpassword',
        },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('create error');

    vi.mocked(create).mockRejectedValue(error);

    await createUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia actualizar un usuario', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/users/1',
        params: { email: 'john.doe@example.com' },
        body: { name: 'John Smith' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(update).mockResolvedValue({
      ...mockUser,
      name: 'John Smith',
    } as never);

    await updateUser(req, res, next);

    expect(update).toHaveBeenCalledWith(req.params.email, req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'User updated successfully',
      data: { ...mockUser, name: 'John Smith' },
    });
  });

  test('debería manejar errores al actualizar un usuario', async () => {
    const req = createRequest({
        method: 'PATCH',
        url: '/api/users/1',
        params: { email: 'john.doe@example.com' },
        body: { name: 'John Smith' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('update error');

    vi.mocked(update).mockRejectedValue(error);

    await updateUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('debería obtener todos los usuarios', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/users',
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(findMany).mockResolvedValue([mockUser] as never);

    await getUsers(req, res, next);

    expect(findMany).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Users obtained successfully',
      data: [mockUser],
    });
  });

  test('debería manejar errores al obtener los usuarios', async () => {
    const req = createRequest({
        method: 'GET',
        url: '/api/users',
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('findMany error');

    vi.mocked(findMany).mockRejectedValue(error);

    await getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('deberia eliminar un usuario', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/users/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(softDelete).mockResolvedValue(undefined as never);

    await deleteUser(req, res, next);

    expect(softDelete).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'User deleted successfully',
    });
  });

  test('debería manejar errores al eliminar un usuario', async () => {
    const req = createRequest({
        method: 'DELETE',
        url: '/api/users/1',
        params: { id: '1' },
      }),
      res = createResponse(),
      next = vi.fn(),
      error = new Error('delete Error');

    vi.mocked(softDelete).mockRejectedValue(error);

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
