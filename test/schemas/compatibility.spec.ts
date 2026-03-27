import { compatibilitySchema } from '#schemas/compatibility';
import { describe, expect, test } from 'vitest';

describe('Compatibility schema', () => {
  test('debe validar un objeto de compatibilidad válido', () => {
    const validCompatibility = {
      vehicleId: [1, 3],
      productId: 1,
      notes: 'Compatible con este vehículo',
      active: true,
    };
    const result = compatibilitySchema.safeParse(validCompatibility);
    expect(result.success).toBe(true);
  });
});
