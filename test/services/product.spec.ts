import type { ProductSchema } from '#schemas/product';
import type { ProductModel } from 'generated/prisma/models';
import {
  create,
  createMany,
  findMany,
  findUnique,
  softDelete,
  update,
} from '#services/product';
import { prismaMock } from 'test/prismaMock';
import { describe, expect, test } from 'vitest';

const product = {
  id: 1,
  sku: 'HON-CB500-BRK',
  name: 'Pastillas de Freno Delanteras Honda CB500',
  price: 125000,
  minStock: 10,
  categoryId: 3,
  brandId: 2,
  createdAt: '2026-02-06T14:22:12.410Z',
  updatedAt: '2026-02-06T14:22:12.410Z',
  active: true,
  slug: 'pastillas-de-freno-delanteras-honda-cb500',
};

const products = [
  {
    id: 1,
    name: 'Pastillas de Freno Delanteras Honda CB500',
    slug: 'pastillas-de-freno-delanteras-honda-cb500',
    sku: 'HON-CB500-BRK',
    price: 125000,
    minStock: 10,
    active: true,
    categoryId: 3,
    brandId: 2,
    createdAt: '2026-02-06T14:22:12.410Z',
    updatedAt: '2026-02-06T14:22:12.410Z',
  },
  {
    id: 2,
    name: 'Pastillas de Freno Delanteras XTZ 250',
    slug: 'pastillas-de-freno-delanteras-xtz-250',
    sku: 'YAM-XTZ-250-BRK',
    price: 125000,
    minStock: 10,
    active: true,
    categoryId: 3,
    brandId: 2,
    createdAt: '2026-02-06T14:22:12.410Z',
    updatedAt: '2026-02-06T14:22:12.410Z',
  },
];

describe('Product Service', () => {
  test('Debe crear un producto', async () => {
    const mockProduct = {
      name: 'Pastillas de Freno Delanteras Honda CB500',
      slug: 'pastillas-de-freno-delanteras-honda-cb500',
      sku: 'HON-CB500-BRK',
      price: 125000,
      minStock: 10,
      active: true,
      categoryId: 3,
      brandId: 2,
    };
    await create(mockProduct);

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: mockProduct,
    });
    expect(prismaMock.product.create).toHaveBeenCalledTimes(1);
  });

  test('Debe crear varios productos', async () => {
    const mockProducts = [
      {
        name: 'Pastillas de Freno Delanteras XTZ 250',
        slug: 'pastillas-de-freno-delanteras-xtz-250',
        sku: 'YAM-XTZ-250-BRK',
        price: 125000,
        minStock: 10,
        active: true,
        categoryId: 3,
        brandId: 2,
      },
      {
        name: 'Pastillas de Freno Delanteras Honda CB500',
        slug: 'pastillas-de-freno-delanteras-honda-cb500',
        sku: 'HON-CB500-BRK',
        price: 125000,
        minStock: 10,
        active: true,
        categoryId: 3,
        brandId: 2,
      },
    ];

    await createMany(mockProducts);
    expect(prismaMock.product.createMany).toHaveBeenCalledWith({
      data: mockProducts,
      skipDuplicates: true,
    });
  });

  test('Debe lazar un error si los datos no son un arreglo', async () => {
    const mockData = { name: 'Ducati' };

    const result = await createMany(mockData as unknown as ProductSchema[]);

    expect(prismaMock.product.createMany).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('Debe devolver varios productos', async () => {
    prismaMock.product.findMany.mockResolvedValue(
      products as unknown as ProductModel[],
    );
    const result = await findMany();

    expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    expect(products).toEqual(result);
  });

  test('Debe devolver varios productos', async () => {
    prismaMock.product.findMany.mockResolvedValue(
      products as unknown as ProductModel[],
    );
    const result = await findMany('pastillas');

    expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    expect(products).toEqual(result);
  });

  test('Debe devolver varios productos', async () => {
    prismaMock.product.findMany.mockResolvedValue(
      products as unknown as ProductModel[],
    );
    const result = await findMany('', true);

    expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    expect(products).toEqual(result);
  });

  test('Debe devolver un producto por su id', async () => {
    prismaMock.product.findUnique.mockResolvedValue(
      product as unknown as ProductModel,
    );
    const result = await findUnique(1);
    expect(result).toEqual(product);
    expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
  });

  test('Debe actualizar un producto por su id', async () => {
    prismaMock.product.update.mockResolvedValue(
      product as unknown as ProductModel,
    );
    const result = await update(1, { name: 'Caneda 256 Chojo' });
    expect(prismaMock.product.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual(product);
  });

  test('No debe generar slug si el nombre no está presente', async () => {
    const mockData = { active: false };

    await update(1, mockData);

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  test('Debe inactivar un producto por su id', async () => {
    prismaMock.product.update.mockResolvedValue(
      product as unknown as ProductModel,
    );
    await softDelete(1);
    expect(prismaMock.product.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });
});
