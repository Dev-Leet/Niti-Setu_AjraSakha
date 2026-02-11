export const MINISTRIES = [
  'Ministry of Agriculture and Farmers Welfare',
  'Ministry of Rural Development',
  'Ministry of Social Justice and Empowerment',
  'Ministry of Tribal Affairs',
  'Ministry of Women and Child Development',
  'Ministry of Food Processing Industries',
  'Ministry of Fisheries, Animal Husbandry and Dairying',
] as const;

export type Ministry = typeof MINISTRIES[number];