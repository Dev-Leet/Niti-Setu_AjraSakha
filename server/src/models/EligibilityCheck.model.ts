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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'FarmerProfile',
      required: true,
      index: true,
    },
    results: [
      {
        schemeId: { type: String, required: true },
        schemeName: { type: String, required: true },
        isEligible: { type: Boolean, required: true },
        confidence: { type: Number, required: true, min: 0, max: 1 },
        reasoning: { type: String, required: true },
        citations: [
          {
            page: Number,
            paragraph: Number,
            text: String,
            documentUrl: String,
          },
        ],
        benefits: {
          financial: {
            amount: Number,
            type: String,
            frequency: String,
          },
          nonFinancial: [String],
        },
      },
    ],
    totalEligible: {
      type: Number,
      required: true,
      default: 0,
    },
    totalBenefits: {
      type: Number,
      required: true,
      default: 0,
    },
    processingTime: {
      type: Number,
      required: true,
    },
    cacheHit: {
      type: Boolean,
      default: false,
    },
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