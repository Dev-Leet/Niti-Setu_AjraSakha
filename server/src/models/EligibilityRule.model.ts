import mongoose, { Schema } from 'mongoose';

const eligibilityRuleSchema = new Schema({
  schemeId: { type: String, required: true, index: true },
  schemeName: { type: String, required: true },
  rules: [{
    field: { type: String, required: true },
    operator: { type: String, enum: ['eq', 'lt', 'gt', 'lte', 'gte', 'in', 'contains'], required: true },
    value: Schema.Types.Mixed,
    sourceChunkId: { type: Schema.Types.ObjectId, ref: 'SchemeChunk' },
    citationText: String,
    pageNumber: Number,
  }],
  combinationLogic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  extractedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const EligibilityRule = mongoose.model('EligibilityRule', eligibilityRuleSchema);