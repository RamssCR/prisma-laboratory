import { idParams } from '#schemas/idParam';
import { describe, expect, test } from 'vitest';

describe('Id Param Schema', () => {
  test('debe validar un id válido', () => {
    const validId = {
      id: 1,
    };
    const result = idParams.safeParse(validId);
    expect(result.success).toBe(true);
  });
});
