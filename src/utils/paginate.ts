/**
 *
 * @param page number
 * @param limit n
 * @returns [number, number]
 * @description Returns a range of numbers to be used for pagination.
 * @example getRange(0, 10) => [0, 9]. Page 0, limit 10. Page 0 will return 10 items, 0 inclusive.
 * @example getRange(1, 10) => [10, 19]. Page 1, limit 10. Page 1 will return 10 items, 10 inclusive.
 */
export function getRange(page: number, limit: number) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}
