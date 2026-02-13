import { describe, test, expect } from 'vitest';
import { prismaMock } from '../prismaMock';
import { create, createMany } from '#services/category';

describe('Category Service', () => {
  const category = {
    id: 1,
    name: 'Aceite',
    slug: 'aceite',
    active: true,
    createdAt: new Date('2026-01-27T14:17:07.954Z'),
    updatedAt: new Date('2026-01-27T14:17:07.954Z'),
  };

  test('Debe de crear una categoria', async () => {
    prismaMock.category.create.mockResolvedValue(category);

    const result = await create(category);

    expect((result as typeof category).name).toBe('Aceite');
  });

  test('debe crear múltiples categorías generando sus respectivos slugs', async () => {
    const mockData = [{ name: 'Frenos y Llantas' }, { name: 'Motor' }];

    await createMany(mockData);

    expect(prismaMock.category.createMany).toHaveBeenCalledTimes(1);

    expect(prismaMock.category.createMany).toHaveBeenCalledWith({
      data: [
        { name: 'Frenos y Llantas', slug: 'frenos-y-llantas' },
        { name: 'Motor', slug: 'motor' },
      ],
      skipDuplicates: true,
    });
  });

  test('debe manejar un arreglo vacío correctamente', async () => {
    await createMany([]);

    expect(prismaMock.category.createMany).toHaveBeenCalledWith({
      data: [],
      skipDuplicates: true,
    });
  });

  test('Debe devolver todos las categorias activas', async () => {
    const categories = [
      {
        id: 1,
        name: 'Frenos',
        slug: 'frenos',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Motor',
        slug: 'motor',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prismaMock.category.findMany.mockResolvedValue(categories);
  });
});
