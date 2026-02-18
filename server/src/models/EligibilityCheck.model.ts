import mongoose, { Schema, Document } from 'mongoose';

interface Citation {
  text: string;
  page: number;
  section?: string;
  confidence: number;
}

interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
  metadata: {
    ruleMatched: string;
    contextUsed: boolean;
  };
}

export interface IEligibilityCheck extends Document {
  userId: string;
  results: EligibilityResult[];
  processingTime: number;
  totalEligible: number;
  createdAt: Date;
}

const eligibilityCheckSchema = new Schema<IEligibilityCheck>(
  {
    userId: { type: String, required: true, index: true },
    results: [
      {
        schemeId: { type: String, required: true },
        schemeName: { type: String, required: true },
        isEligible: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
        reasoning: { type: String, required: true },
        citations: [
          {
            text: { type: String, required: true },
            page: { type: Number, required: true },
            section: { type: String },
            confidence: { type: Number, required: true },
          },
        ],
        metadata: {
          ruleMatched: { type: String, required: true },
          contextUsed: { type: Boolean, required: true },
        },
      },
    ],
    processingTime: { type: Number, required: true },
    totalEligible: { type: Number, required: true },
  },
  { timestamps: true }
);

export const EligibilityCheck = mongoose.model<IEligibilityCheck>('EligibilityCheck', eligibilityCheckSchema);