import { z } from 'zod';

export const searchQuery = z.object({
  search: z.string().min(2).toLowerCase(),
});

export type SearchQuery = z.infer<typeof searchQuery>;
