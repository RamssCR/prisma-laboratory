import { prisma } from '#config/db';
import type { ProductSchema } from '#schemas/product';
import type { SearchQuery } from '#schemas/searchQuery';
import slug from 'slug';

export const create = (data: ProductSchema) =>
  !Array.isArray(data) &&
  prisma.product.create({ data: { ...data, slug: slug(data.name) } });

export const createMany = async (data: ProductSchema[]) => {
  if (Array.isArray(data)) {
    const slugData = data.map((item) => ({
      ...item,
      slug: slug(item.name),
    }));
    await prisma.product.createMany({
      data: slugData,
      skipDuplicates: true,
    });
  }
};

export const update = (id: number, data: Partial<ProductSchema>) =>
  prisma.product.update({
    where: { id },
    data: data.name ? { ...data, slug: slug(data.name) } : data,
  });

export const findMany = (searchItem?: SearchQuery['search']) =>
  prisma.product.findMany({
    where: {
      active: true,
      ...(searchItem
        ? {
            OR: [
              { slug: { contains: searchItem, mode: 'insensitive' } },
              {
                brand: { slug: { contains: searchItem, mode: 'insensitive' } },
              },
              {
                category: {
                  slug: { contains: searchItem, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

export const findUnique = (id: number) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

export const softDelete = (id: number) =>
  prisma.product.update({ where: { id }, data: { active: false } });
