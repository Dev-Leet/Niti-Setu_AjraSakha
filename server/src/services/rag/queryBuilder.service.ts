interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropType: string;
  socialCategory: string;
}

export const queryBuilderService = {
  buildEligibilityQuery(profile: FarmerProfile): string {
    return `Eligibility criteria check
State: ${profile.state}
District: ${profile.district}
Land Holding: ${profile.landholding} acres
Crop Type: ${profile.cropType}
Category: ${profile.socialCategory}

Looking for eligibility conditions, requirements, qualifications, and criteria.`;
  },

  buildSchemeSearchQuery(keywords: string[]): string {
    return `Agricultural scheme information
Keywords: ${keywords.join(', ')}

Looking for scheme details, benefits, application process.`;
  },

  buildBenefitQuery(profile: FarmerProfile): string {
    return `Scheme benefits and assistance
Farmer type: ${profile.socialCategory}
Land size: ${profile.landholding} acres
Crops: ${profile.cropType}

Looking for financial assistance, subsidies, support programs.`;
  },
};