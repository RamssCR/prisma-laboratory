import { z } from 'zod';

export const inventorySchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int(),
  type: z.enum(['ENTRADA', 'VENTA', 'AJUSTE']).default('ENTRADA'),
});

export type InventorySchema = z.infer<typeof inventorySchema>;
