export const CROP_TYPES = [
  'rice',
  'wheat',
  'maize',
  'jowar',
  'bajra',
  'ragi',
  'cotton',
  'sugarcane',
  'groundnut',
  'soybean',
  'sunflower',
  'mustard',
  'pulses',
  'vegetables', 
  'fruits',
  'spices',
  'tea',
  'coffee',
  'rubber',
] as const;

export type CropType = typeof CROP_TYPES[number];