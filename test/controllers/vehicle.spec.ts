import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from '#controllers/vehicle';
import {
  create,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/vehicle';
import { createRequest, createResponse } from 'node-mocks-http';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('#services/vehicle', () => ({
  create: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
}));

const mockVehicle = {
  id: 1,
  brandId: 4,
  model: 'Gixxer 250 SF',
  year: 2023,
  displacement: 249,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  active: true,
};

describe('Vehicle Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should create a new vehicle', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/api/vehicles',
      body: {
        model: 'Gixxer 250 SF',
        year: 2023,
        displacement: 249,
        active: true,
        brandId: 4,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.mocked(create).mockResolvedValue(mockVehicle as never);

    await createVehicle(req, res, next);

    expect(create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Vehicle created successfully',
      data: mockVehicle,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next(error) when create fails', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/api/vehicles',
      body: { model: 'Gixxer 250 SF' },
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('create failed');

    vi.mocked(create).mockRejectedValue(error as never);

    await createVehicle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should return all vehicles', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/vehicles',
    });
    const res = createResponse();
    const next = vi.fn();
    const vehicles = [mockVehicle];

    vi.mocked(findMany).mockResolvedValue(vehicles as never);

    await getVehicles(req, res, next);

    expect(findMany).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next(error) when getVehicles fails', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/vehicles',
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('findMany failed');

    vi.mocked(findMany).mockRejectedValue(error as never);

    await getVehicles(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should return one vehicle by id', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/vehicles/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.mocked(findUnique).mockResolvedValue(mockVehicle as never);

    await getVehicle(req, res, next);

    expect(findUnique).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Vehicle obtained successfully',
      data: mockVehicle,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next(error) when getVehicle fails', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/api/vehicles/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('findUnique failed');

    vi.mocked(findUnique).mockRejectedValue(error as never);

    await getVehicle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should update one vehicle by id', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/api/vehicles/1',
      params: { id: '1' },
      body: { model: 'Updated model' },
    });
    const res = createResponse();
    const next = vi.fn();
    const updatedVehicle = { ...mockVehicle, model: 'Updated model' };

    vi.mocked(update).mockResolvedValue(updatedVehicle as never);

    await updateVehicle(req, res, next);

    expect(update).toHaveBeenCalledWith(1, req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next(error) when updateVehicle fails', async () => {
    const req = createRequest({
      method: 'PATCH',
      url: '/api/vehicles/1',
      params: { id: '1' },
      body: { model: 'Updated model' },
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('update failed');

    vi.mocked(update).mockRejectedValue(error as never);

    await updateVehicle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('should soft delete one vehicle by id', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/api/vehicles/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.mocked(softDelete).mockResolvedValue(undefined as never);

    await deleteVehicle(req, res, next);

    expect(softDelete).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Vehicle deleted successfully',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next(error) when deleteVehicle fails', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/api/vehicles/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();
    const error = new Error('softDelete failed');

    vi.mocked(softDelete).mockRejectedValue(error as never);

    await deleteVehicle(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
