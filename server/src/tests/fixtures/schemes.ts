export const mockSchemes = [
  {
    schemeId: 'PM-KISAN-2024',
    name: { en: 'PM-KISAN', hi: 'पीएम-किसान', mr: 'पीएम-किसान' },
    description: {
      en: 'Income support to farmers',
      hi: 'किसानों को आय सहायता',
      mr: 'शेतकऱ्यांना उत्पन्न समर्थन',
    },
    ministry: 'Agriculture',
    department: 'Agriculture & Farmers Welfare',
    isActive: true,
    targetAudience: ['small-farmers', 'marginal-farmers'],
    eligibility: {
      states: ['Maharashtra', 'Punjab'],
      maxLandholding: 2,
      socialCategories: ['general', 'obc', 'sc', 'st'],
    },
    benefits: {
      financial: { amount: 6000, type: 'grant', frequency: 'yearly' },
      nonFinancial: [],
    },
    applicationProcess: { mode: 'online', steps: [] },
    requiredDocuments: ['aadhar', 'land-records'],
    tags: ['agriculture', 'income-support'],
  },
];