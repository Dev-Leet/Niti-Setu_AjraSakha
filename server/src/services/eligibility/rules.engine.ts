import { EligibilityRule } from '@models/EligibilityRule.model.js';

interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropTypes: string[];
  socialCategory: string;
  [key: string]: string | number | string[];
}

interface Rule {
  field: string;
  operator: 'eq' | 'lte' | 'gte' | 'in' | 'includes';
  value: string | number | string[];
}

export const rulesEngine = {
  async evaluateEligibility(schemeId: string, profile: FarmerProfile): Promise<boolean> {
    const rule = await EligibilityRule.findOne({ schemeId });

    if (!rule || !rule.rules || rule.rules.length === 0) {
      return false;
    }

    const combinationLogic = rule.combinationLogic || 'AND';
    const results = rule.rules.map(r => this.evaluateRule(r, profile));

    if (combinationLogic === 'OR') {
      return results.some(r => r);
    }

    return results.every(r => r);
  },

  async checkEligibilityDetailed(schemeId: string, profile: FarmerProfile): Promise<{
    isEligible: boolean;
    matchedRules: string[];
    failedRules: string[];
    confidence: number;
  }> {
    const rule = await EligibilityRule.findOne({ schemeId });

    if (!rule || !rule.rules || rule.rules.length === 0) {
      return {
        isEligible: false,
        matchedRules: [],
        failedRules: [],
        confidence: 0,
      };
    }

    const matchedRules: string[] = [];
    const failedRules: string[] = [];

    for (const r of rule.rules) {
      const matches = this.evaluateRule(r, profile);
      const ruleDesc = `${r.field} ${r.operator} ${JSON.stringify(r.value)}`;
      
      if (matches) {
        matchedRules.push(ruleDesc);
      } else {
        failedRules.push(ruleDesc);
      }
    }

    const combinationLogic = rule.combinationLogic || 'AND';
    const isEligible = combinationLogic === 'OR' 
      ? matchedRules.length > 0 
      : failedRules.length === 0;

    const confidence = rule.rules.length > 0 
      ? matchedRules.length / rule.rules.length 
      : 0;

    return {
      isEligible,
      matchedRules,
      failedRules,
      confidence,
    };
  },

  async createRule(schemeId: string, rules: Rule[], combinationLogic: 'AND' | 'OR' = 'AND'): Promise<void> {
  await EligibilityRule.findOneAndUpdate(
    { schemeId },
    { schemeId, rules, combinationLogic },
    { upsert: true, new: true }
  );
},

  evaluateRule(
    rule: { field: string; operator: string; value: string | number | string[] },
    profile: FarmerProfile
  ): boolean {
    const fieldValue = profile[rule.field];

    if (fieldValue === undefined) {
      return false;
    }

    switch (rule.operator) {
      case 'eq':
        return fieldValue === rule.value;
      case 'lte':
        return typeof fieldValue === 'number' && fieldValue <= (rule.value as number);
      case 'gte':
        return typeof fieldValue === 'number' && fieldValue >= (rule.value as number);
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(fieldValue as string);
      case 'includes':
        return (
          Array.isArray(fieldValue) &&
          Array.isArray(rule.value) &&
          rule.value.some(v => (fieldValue as string[]).includes(v))
        );
      default:
        return false;
    }
  },
};

export default rulesEngine;