import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(5),
  price: z.number().int().positive(),
  minStock: z.number().int().positive(),
  active: z.boolean().optional(),
  categoryId: z.number().int().positive(),
  brandId: z.number().int().positive(),
});

export type ProductSchema = z.infer<typeof productSchema>;
