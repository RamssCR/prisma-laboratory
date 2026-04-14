import { createCompatibility } from '#controllers/compatibility';
import { create } from '#services/compatibility';
import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';

vi.mock('#services/compatibility', () => ({
  create: vi.fn(),
}));

const mockCompatibility = {
  productId: 6,
  vehicleId: [1, 2],
  notes: 'Compatibilidad alta',
};

describe(' Controllers compatibility', () => {
  test('Deberia crear una compatibilidad correctamente', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/compatibilities',
        body: mockCompatibility,
      }),
      res = createResponse(),
      next = vi.fn();

    vi.mocked(create).mockResolvedValue({ count: 2 });

    await createCompatibility(req, res, next);

    expect(create).toHaveBeenCalledWith(mockCompatibility);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Compatibility created successfully',
      data: { count: 2 },
    });
  });

  test('Deberia manejar errores al crear una compatibilidad', async () => {
    const req = createRequest({
        method: 'POST',
        url: '/api/compatibilities',
        body: mockCompatibility,
      }),
      res = createResponse(),
      next = vi.fn();
    const error = new Error('Error al crear compatibilidad');

    vi.mocked(create).mockRejectedValue(error);
    await createCompatibility(req, res, next);

    expect(create).toHaveBeenCalledWith(mockCompatibility);
    expect(next).toHaveBeenCalledWith(error);
  });
});
