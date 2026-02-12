/* import { describe, test, expect } from 'vitest';
import { prismaMock } from '../prismaMock';
import { create } from '#services/category';

describe('User Service', () => {
  test('debe crear usuario', async () => {
    prismaMock.category.create.mockResolvedValue({ name: 'Bujia' });

    const result = await create({ name: 'Bujia' });

    expect(result.name).toBe('Bujia');
  });
});*/
