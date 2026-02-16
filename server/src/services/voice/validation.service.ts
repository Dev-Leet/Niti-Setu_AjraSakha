interface VoiceProfile {
  fullName?: string;
  state?: string;
  district?: string;
  pincode?: string;
  landholding?: number;
  cropTypes?: string[];
  socialCategory?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number;
}

const INDIAN_STATES = [
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand',
  'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur',
  'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
  'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura',
  'uttar pradesh', 'uttarakhand', 'west bengal',
];

const SOCIAL_CATEGORIES = ['general', 'obc', 'sc', 'st', 'ews'];

const COMMON_CROPS = [
  'rice', 'wheat', 'cotton', 'sugarcane', 'maize', 'bajra', 'jowar',
  'pulses', 'groundnut', 'soybean', 'mustard', 'sunflower', 'potato',
  'onion', 'tomato', 'tea', 'coffee', 'rubber', 'coconut',
];

export const voiceValidationService = {
  validateProfile(profile: VoiceProfile): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence = 1.0;

    if (!profile.state) {
      errors.push('State is required');
      confidence -= 0.2;
    } else if (!this.validateState(profile.state)) {
      warnings.push(`State "${profile.state}" not recognized, please verify`);
      confidence -= 0.1;
    }

    if (!profile.district) {
      errors.push('District is required');
      confidence -= 0.2;
    }

    if (!profile.landholding) {
      errors.push('Land holding is required');
      confidence -= 0.2;
    } else if (profile.landholding < 0 || profile.landholding > 1000) {
      warnings.push('Land holding seems unusual, please verify');
      confidence -= 0.1;
    }

    if (!profile.cropTypes || profile.cropTypes.length === 0) {
      errors.push('At least one crop type is required');
      confidence -= 0.2;
    } else {
      const unrecognizedCrops = profile.cropTypes.filter(c => !this.validateCrop(c));
      if (unrecognizedCrops.length > 0) {
        warnings.push(`Crops not recognized: ${unrecognizedCrops.join(', ')}`);
        confidence -= 0.05 * unrecognizedCrops.length;
      }
    }

    if (!profile.socialCategory) {
      errors.push('Social category is required');
      confidence -= 0.2;
    } else if (!this.validateSocialCategory(profile.socialCategory)) {
      warnings.push(`Social category "${profile.socialCategory}" not recognized`);
      confidence -= 0.1;
    }

    if (profile.pincode && !this.validatePincode(profile.pincode)) {
      warnings.push('Pincode format seems incorrect');
      confidence -= 0.05;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence: Math.max(0, Math.min(1, confidence)),
    };
  },

  validateState(state: string): boolean {
    return INDIAN_STATES.includes(state.toLowerCase());
  },

  validateSocialCategory(category: string): boolean {
    return SOCIAL_CATEGORIES.includes(category.toLowerCase());
  },

  validateCrop(crop: string): boolean {
    return COMMON_CROPS.includes(crop.toLowerCase());
  },

  validatePincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode);
  },

  normalizeCropName(crop: string): string {
    const normalized = crop.toLowerCase().trim();
    const mapping: Record<string, string> = {
      'paddy': 'rice',
      'dhan': 'rice',
      'gehu': 'wheat',
      'makka': 'maize',
      'kapas': 'cotton',
    };
    return mapping[normalized] || normalized;
  },

  normalizeStateName(state: string): string {
    const normalized = state.toLowerCase().trim();
    const stateMatch = INDIAN_STATES.find(s => s === normalized || s.includes(normalized));
    return stateMatch || state;
  },
};