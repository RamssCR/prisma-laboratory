import { prisma } from '#config/db';
import type { ProductSchema } from '#schemas/product';
import type { SearchQuery } from '#schemas/searchQuery';
import slug from 'slug';

/**
 * Crea un producto en la base de datos
 * @param data Datos de creacion
 * @returns Producto creado
 * @example
 * await create({ name: "kit", sku: "2JH7KJ", price: 23000, minStock: 1, ...})
 */
export const create = (data: ProductSchema) =>
  !Array.isArray(data) &&
  prisma.product.create({ data: { ...data, slug: slug(data.name) } });

/**
 * Crea varios productos en la base de datos
 * @param data Datos de creacion
 * @returns Nada
 * @example
 * await createMany([{...}, {...}, ...])
 */
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

/**
 * Actualiza un producto en la base de datos por su id
 * @param id Id producto
 * @param data Datos actualizacion
 * @returns Prodcuto actualizado
 * @example
 * await update(1, { sku: 12JGG33 })
 */
export const update = (id: number, data: Partial<ProductSchema>) =>
  prisma.product.update({
    where: { id },
    data: data.name ? { ...data, slug: slug(data.name) } : data,
  });

/**
 * Devuelve todos los productos dependiendo del filtro de busqueda
 * @param searchItem Input de busqueda
 * @returns Productos encotrados
 * @example
 * await findMany("yamaha")
 * // returns - data: [{...}, {...}]
 */
export const findMany = (searchItem?: SearchQuery['search'], mov?: boolean) =>
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
              {
                compatibility: {
                  some: {
                    vehicle: {
                      model: { contains: searchItem, mode: 'insensitive' },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      movements: mov
        ? {
            where: { active: true },
            select: { quantity: true },
          }
        : {},
    },
  });

/**
 * Devuelve un producto dependiendo del id dado
 * @param id Id del producto
 * @returns Producto encontrado
 * @example
 * await findUnique(1)
 * // returns - data: { name: Kit arraste, ...}
 */
export const findUnique = (id: number) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

/**
 * Inactiva un producto dependiendo el id dado
 * @param id Id del producto
 * @returns Nada
 * @example
 * await softDelete(1)
 */
export const softDelete = (id: number) =>
  prisma.product.update({ where: { id }, data: { active: false } });
