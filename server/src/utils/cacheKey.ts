export const cacheKeys = {
  eligibilityCheck: (profileId: string) => `eligibility:${profileId}`,
  scheme: (schemeId: string) => `scheme:${schemeId}`,
  schemes: (filters: string) => `schemes:${filters}`,
  profile: (userId: string) => `profile:${userId}`,
};