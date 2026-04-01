import { vehicleSchema } from '#schemas/vehicle';
import { describe, expect, test } from 'vitest';

describe('Vehicle Schema', () => {
  test('debe validar un vehículo válido', () => {
    const validVehicle = {
      model: 'Civic',
      year: 2020,
      displacement: 2,
      active: true,
      brandId: 1,
    };
    const result = vehicleSchema.safeParse(validVehicle);
    expect(result.success).toBeTruthy();
  });
});
