import { prisma } from '#config/db';
import type { NameSchema } from '#schemas/name';
import slug from 'slug';

/**
 * Crea una marca en la base de datos
 * @param data Datos de la marca
 * @returns Marca creada
 * @example
 * await create({ name : "Yamaha" })
 */
export const create = (data: NameSchema) =>
  !Array.isArray(data) &&
  prisma.brand.create({ data: { ...data, slug: slug(data.name) } });

/**
 * Crea varias marcas en la base de datos
 * @param data Datos de las marcas
 * @returns nada
 * @example
 * await createMany([{ name: "Yamaha" }, { name: "Suzuki" }])
 */
export const createMany = async (data: NameSchema[]) => {
  if (Array.isArray(data)) {
    const slugData = data.map((item) => ({
      ...item,
      slug: slug(item.name),
    }));
    await prisma.brand.createMany({ data: slugData, skipDuplicates: true });
  }
};

/**
 * Busca todas las marcas activas en la base de datos
 * @returns Marcas encontradas
 * @example
 * await findMany()
 * // returns - brands: [{...}, {...}]
 */
export const findMany = () =>
  prisma.brand.findMany({ where: { active: true } });

/**
 * Busca la marca por el id dado
 * @param id Id de la marca
 * @returns Marca encontrada
 * @example
 * await findUnique(1)
 * // returns - brand: {...}
 */
export const findUnique = (id: number) =>
  prisma.brand.findUnique({ where: { id, active: true } });

/**
 * Actualiza una marca en la base de datos por su id
 * @param id Id de la marca
 * @param data Informacion a actualizar
 * @returns Marca actualizada
 * @example
 * await update(1, { active: true })
 */
export const update = (id: number, data: Partial<NameSchema>) =>
  !Array.isArray(data) &&
  prisma.brand.update({
    where: { id },
    data: data.name ? { ...data, slug: slug(data.name) } : data,
  });

/**
 * Inactiva una marca de la base de datos
 * @param id Id de la marca
 * @returns Nada
 * @example
 * await softdelete(1)
 */
export const softDelete = (id: number) =>
  prisma.brand.update({ where: { id }, data: { active: false } });
