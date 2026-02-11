import { Scheme } from '@models/index.js';
import { logger } from '@utils/logger.js';

const schemes = [
  {
    schemeId: 'PM-KISAN',
    name: {
      en: 'PM-KISAN',
      hi: 'पीएम-किसान',
    },
    description: {
      en: 'Pradhan Mantri Kisan Samman Nidhi - Income support for farmers',
      hi: 'प्रधानमंत्री किसान सम्मान निधि - किसानों के लिए आय सहायता',
    },
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Income Support',
    status: 'active',
    eligibilityRules: {
      maxLandholding: 2,
      allowedCategories: ['General', 'SC', 'ST', 'OBC'],
    },
    benefits: {
      financial: {
        amount: 6000,
        type: 'Direct Benefit Transfer',
        frequency: 'Annual',
        disbursementMode: 'Bank Transfer',
      },
      nonFinancial: [],
    },
    requiredDocuments: ['Aadhar Card', 'Land Records', 'Bank Account Details'],
    officialUrl: 'https://pmkisan.gov.in',
    pdfDocuments: [],
  },
];

export const seedSchemes = async (): Promise<void> => {
  try {
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);
    logger.info('Schemes seeded successfully');
  } catch (error) {
    logger.error('Scheme seeding failed:', error);
    throw error;
  }
};