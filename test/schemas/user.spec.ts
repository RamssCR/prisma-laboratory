import { userSchema } from '#schemas/user';
import { describe, expect, test } from 'vitest';

describe('User Schema', () => {
  test('debe validar un usuario válido', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      active: true,
    };
    const result = userSchema.safeParse(validUser);
    expect(result.success).toBeTruthy();
  });
});
