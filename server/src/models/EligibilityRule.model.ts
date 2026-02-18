/* import mongoose, { Schema } from 'mongoose';

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

export const EligibilityRule = mongoose.model('EligibilityRule', eligibilityRuleSchema); */

import mongoose, { Schema, Document } from 'mongoose';

interface Rule {
  field: string;
  operator: 'eq' | 'lte' | 'gte' | 'in' | 'includes';
  value: string | number | string[];
}

export interface IEligibilityRule extends Document {
  schemeId: string;
  rules: Rule[];
  createdAt: Date;
  updatedAt: Date;
}

const eligibilityRuleSchema = new Schema<IEligibilityRule>(
  {
    schemeId: { type: String, required: true, unique: true, index: true },
    rules: [
      {
        field: { type: String, required: true },
        operator: { type: String, enum: ['eq', 'lte', 'gte', 'in', 'includes'], required: true },
        value: { type: Schema.Types.Mixed, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const EligibilityRule = mongoose.model<IEligibilityRule>('EligibilityRule', eligibilityRuleSchema);