import mongoose, { Schema, Document } from 'mongoose';

export interface IEligibilityCheck extends Document {
  userId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  results: Array<{
    schemeId: string;
    schemeName: string;
    isEligible: boolean;
    confidence: number;
    reasoning: string;
    citations: Array<{
      page: number;
      paragraph: number;
      text: string;
      documentUrl: string;
    }>;
    benefits: {
      financial: {
        amount: number;
        type: string;
        frequency: string;
      };
      nonFinancial: string[];
    };
  }>;
  totalEligible: number;
  totalBenefits: number;
  processingTime: number;
  cacheHit: boolean;
}

const eligibilityCheckSchema = new Schema<IEligibilityCheck>(
  {
    userId: { type: String, required: true, index: true },
    profileId: { type: Schema.Types.ObjectId, required: true, ref: 'FarmerProfile' },
    results: [schemeResultSchema],
    totalEligible: { type: Number, required: true },
    totalBenefits: { type: Number, required: true },
    processingTime: { type: Number, required: true },
    cacheHit: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'eligibility_checks',
  }
);

export const EligibilityCheck = mongoose.model<IEligibilityCheck>(
  'EligibilityCheck',
  eligibilityCheckSchema
);