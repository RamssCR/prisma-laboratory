import { describe, test, expect } from 'vitest';
import { prismaMock } from '../prismaMock';
import {
  create,
  createMany,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/category';
import type { NameSchema } from '#schemas/name';

const category = {
  id: 1,
  name: 'Aceite',
  slug: 'aceite',
  active: true,
  createdAt: new Date('2026-01-27T14:17:07.954Z'),
  updatedAt: new Date('2026-01-27T14:17:07.954Z'),
};
describe('Category Service', () => {
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

  test('Debe lazar un error si los datos no son un arreglo', async () => {
    const mockData = { name: 'Frenos y Llantas' };

    const result = await createMany(mockData as unknown as NameSchema[]);

    expect(prismaMock.category.createMany).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
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
    const result = await findMany();

    expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.category.findMany).toHaveBeenLastCalledWith({
      where: { active: true },
    });
    expect(result).toEqual(categories);
  });

  test('debe retornar un arreglo vacío si no hay categorías en la base de datos', async () => {
    prismaMock.category.findMany.mockResolvedValue([]);
    const result = await findMany();

    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      where: { active: true },
    });
    expect(result).toEqual([]);
  });

  test('Debe devolver una categoria por su id', async () => {
    prismaMock.category.findUnique.mockResolvedValue(category);
    const result = await findUnique(1);
    expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(category);
  });

  test('Debe actualizar la categoria por su id', async () => {
    prismaMock.category.update.mockResolvedValue(category);
    await update(1, category);

    expect(prismaMock.category.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        id: 1,
        name: 'Aceite',
        slug: 'aceite',
        active: true,
        createdAt: new Date('2026-01-27T14:17:07.954Z'),
        updatedAt: new Date('2026-01-27T14:17:07.954Z'),
      },
    });
  });

  test('No debe generar slug si el nombre no está presente', async () => {
    const mockData = { active: false };

    await update(1, mockData);

    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  test('Debe desactivar una categoria por su id', async () => {
    prismaMock.category.update.mockResolvedValue(category);
    await softDelete(1);

    expect(prismaMock.category.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });
});
