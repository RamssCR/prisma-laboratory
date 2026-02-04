import { prisma } from '#config/db';
import type { ProductSchema } from '#schemas/product';
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
