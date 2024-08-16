export const normalizeCity = (city: string): string => {
  return city.split(', ').slice(0, 2).join(', ').trim().toLowerCase();
};
