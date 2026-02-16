import { EligibilityRule } from '@models/EligibilityRule.model.js';

interface FarmerProfile {
  state: string;
  district: string;
  landholding: number;
  cropType: string;
  socialCategory: string;
}

export const rulesEngine = {
  async checkEligibility(schemeId: string, profile: FarmerProfile): Promise<boolean> {
    const rule = await EligibilityRule.findOne({ schemeId });
    if (!rule) return false;
    
    const results = rule.rules.map(r => this.evaluateRule(r, profile));
    
    if (rule.combinationLogic === 'AND') {
      return results.every(r => r);
    } else {
      return results.some(r => r);
    }
  },

  async checkEligibilityDetailed(schemeId: string, profile: any): Promise<{
    eligible: boolean;
    matchedRules: number;
    totalRules: number;
  }> {
    const rule = await EligibilityRule.findOne({ schemeId });
    if (!rule) return { eligible: false, matchedRules: 0, totalRules: 0 };
    
    const results = rule.rules.map(r => this.evaluateRule(r, profile));
    const matchedRules = results.filter(r => r).length;
    const totalRules = rule.rules.length;
    
    let eligible: boolean;
    if (rule.combinationLogic === 'AND') {
      eligible = results.every(r => r);
    } else {
      eligible = results.some(r => r);
    }
    
    return {
      eligible,
      matchedRules,
      totalRules,
    };
  },
  
  evaluateRule(rule: any, profile: any): boolean {
    const fieldValue = profile[rule.field];
    const ruleValue = rule.value;
    
    switch (rule.operator) {
      case 'lt': return fieldValue < ruleValue;
      case 'lte': return fieldValue <= ruleValue;
      case 'gt': return fieldValue > ruleValue;
      case 'gte': return fieldValue >= ruleValue;
      case 'eq': return fieldValue === ruleValue;
      case 'in': return Array.isArray(ruleValue) && ruleValue.includes(fieldValue);
      case 'contains': return fieldValue.toLowerCase().includes(ruleValue.toLowerCase());
      default: return false;
    }
  },

  async createRule(schemeId: string, schemeName: string, rules: any[]): Promise<void> {
    await EligibilityRule.findOneAndUpdate(
      { schemeId },
      { schemeId, schemeName, rules, combinationLogic: 'AND' },
      { upsert: true }
    );
  },
};