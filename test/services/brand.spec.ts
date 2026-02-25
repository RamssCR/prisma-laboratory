import type { NameSchema } from '#schemas/name';
import {
  create,
  createMany,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/brand';
import { prismaMock } from 'test/prismaMock';
import { describe, expect, test } from 'vitest';

const brand = {
  id: 1,
  name: 'Yamaha',
  slug: 'yamaha',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Brand Service', () => {
  test('Debe crear una marca', async () => {
    const mockBrand = { name: 'Yamaha' };
    await create(mockBrand);

    expect(prismaMock.brand.create).toHaveBeenCalledWith({
      data: { name: 'Yamaha', slug: 'yamaha' },
    });
    expect(prismaMock.brand.create).toHaveBeenCalledTimes(1);
  });

  test('Debe crear varias marcas', async () => {
    const mockBrands = [{ name: 'Yamaha' }, { name: 'Suzuki' }];

    await createMany(mockBrands);
    expect(prismaMock.brand.createMany).toHaveBeenCalledWith({
      data: [
        { name: 'Yamaha', slug: 'yamaha' },
        { name: 'Suzuki', slug: 'suzuki' },
      ],
      skipDuplicates: true,
    });
  });

  test('Debe lazar un error si los datos no son un arreglo', async () => {
    const mockData = { name: 'Ducati' };

    const result = await createMany(mockData as unknown as NameSchema[]);

    expect(prismaMock.brand.createMany).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('Debe devolver varias marcas', async () => {
    const brands = [
      {
        id: 1,
        name: 'Yamaha',
        slug: 'yamaha',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Suzuki',
        slug: 'suzuki',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.brand.findMany.mockResolvedValue(brands);
    const result = await findMany();

    expect(prismaMock.brand.findMany).toHaveBeenCalledTimes(1);
    expect(brands).toEqual(result);
  });

  test('Debe devolver una marca por su id', async () => {
    prismaMock.brand.findUnique.mockResolvedValue(brand);
    const result = await findUnique(1);
    expect(result).toEqual(brand);
    expect(prismaMock.brand.findUnique).toHaveBeenCalledTimes(1);
  });

  test('Debe actualizar una marca por su id', async () => {
    prismaMock.brand.update.mockResolvedValue(brand);
    const result = await update(1, { name: 'Yamaha Updated' });
    expect(prismaMock.brand.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(brand);
  });

  test('No debe generar slug si el nombre no está presente', async () => {
    const mockData = { active: false };

    await update(1, mockData);

    expect(prismaMock.brand.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  test('Debe inactivar una marca por su id', async () => {
    prismaMock.brand.update.mockResolvedValue(brand);
    await softDelete(1);
    expect(prismaMock.brand.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.brand.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });
});
