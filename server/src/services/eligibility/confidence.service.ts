export const confidenceService = {
  calculateSimilarityScore(retrievalResults: any[]): number {
    if (retrievalResults.length === 0) return 0;
    
    const topScore = retrievalResults[0].score;
    const avgScore = retrievalResults.reduce((sum, r) => sum + r.score, 0) / retrievalResults.length;
    
    return (topScore * 0.6 + avgScore * 0.4);
  },

  calculateRuleMatchConfidence(rulesMatched: number, totalRules: number): number {
    if (totalRules === 0) return 0;
    
    const matchRatio = rulesMatched / totalRules;
    
    if (matchRatio === 1.0) return 0.95;
    if (matchRatio >= 0.8) return 0.85;
    if (matchRatio >= 0.6) return 0.70;
    if (matchRatio >= 0.4) return 0.55;
    
    return 0.40;
  },

  calculateCombinedConfidence(similarityScore: number, ruleMatchConfidence: number): number {
    const weighted = (similarityScore * 0.4) + (ruleMatchConfidence * 0.6);
    
    return Math.round(weighted * 100) / 100;
  },

  getConfidenceLevel(score: number): string {
    if (score >= 0.85) return 'high';
    if (score >= 0.65) return 'medium';
    return 'low';
  },
};