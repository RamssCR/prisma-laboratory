import { nameSchema } from '#schemas/name';
import { describe, expect, test } from 'vitest';

describe('Name Schema', () => {
  test('debe validar un nombre válido', () => {
    const validName = {
      name: 'John Doe',
    };
    const result = nameSchema.safeParse(validName);
    expect(result.success).toBeTruthy();
  });
});
