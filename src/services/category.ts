import { prisma } from '#config/db';
import type { NameSchema } from '#schemas/name';

export const create = (data: NameSchema) => prisma.category.create({ data });

export const findMany = () => prisma.category.findMany();

export const findUnique = (id: number) =>
  prisma.category.findUnique({ where: { id } });

export const update = (id: number, data: Partial<NameSchema>) =>
  prisma.category.update({ where: { id }, data });
