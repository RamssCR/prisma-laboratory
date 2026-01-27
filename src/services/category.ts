import { prisma } from '#config/db';
import type { NameSchema } from '#schemas/name';
import slug from 'slug';

/**
 * Crea una categoria en la base de datos
 * @param data Datos de creacion
 * @returns Categoria creada
 * @example
 * await create({ name: "Aceite" })
 */
export const create = (data: NameSchema) =>
  !Array.isArray(data) &&
  prisma.category.create({ data: { ...data, slug: slug(data.name) } });

/**
 * Crea varias categorias a la vez en la base de datos
 * @param data Datos de creacion
 * @returns Nada
 * @example
 * await createMany([{ name: "Aceite" },{ name: "LLantas" }])
 */
export const createMany = async (data: NameSchema[]) => {
  if (Array.isArray(data)) {
    const slugData = data.map((item) => ({
      ...item,
      slug: slug(item.name),
    }));
    await prisma.category.createMany({
      data: slugData,
      skipDuplicates: true,
    });
  }
};

/**
 * Busca todas las categorias activas en la base de datos
 * @returns Todas las categorias encontradas
 * @example
 * await findMany()
 * // returns - categories: [{...}, {...}]
 */
export const findMany = () =>
  prisma.category.findMany({ where: { active: true } });

/**
 * Busca una categoria por el id dado
 * @param id Id categoria
 * @returns Categoria encontrada
 * @example
 * await findUnique(1)
 * // returns - category : {...}
 */
export const findUnique = (id: number) =>
  prisma.category.findUnique({ where: { id } });

/**
 * Actualiza una categoria por su id
 * @param id Id de la categoria
 * @param data Datos a actualizar
 * @returns Categoria actualizada
 * @example
 * await update(1, { name: piñon delantero })
 */
export const update = (id: number, data: Partial<NameSchema>) =>
  !Array.isArray(data) &&
  prisma.category.update({
    where: { id },
    data: data.name ? { ...data, slug: slug(data.name) } : data,
  });

/**
 * Inactica una categoria de la base de datos por su id
 * @param id Id de la categoria
 * @returns Nada
 * @example
 * await softDelete(1)
 */
export const softDelete = (id: number) =>
  prisma.category.update({ where: { id }, data: { active: false } });
