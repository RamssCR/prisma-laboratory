import { searchQuery } from '#schemas/searchQuery';
import { describe, expect, test } from 'vitest';

describe('Search Query Schema', () => {
  test('debe validar una consulta de búsqueda válida', () => {
    const validSearchQuery = {
      search: 'example search',
    };
    const result = searchQuery.safeParse(validSearchQuery);
    expect(result.success).toBeTruthy();
  });

  test('debe invalidar una consulta de búsqueda con menos de 2 caracteres', () => {
    const invalidSearchQuery = {
      query: 'a',
    };
    const result = searchQuery.safeParse(invalidSearchQuery);
    expect(result.success).toBeFalsy();
  });
});
