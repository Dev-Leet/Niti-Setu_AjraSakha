import mongoose, { Schema, Document } from 'mongoose';

interface Citation {
  page: number;
  paragraph: number;
  text: string;
  documentUrl: string;
} 

interface SchemeResult {
  schemeId: string;
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
  benefits: {
    financial: { amount: number; type: string; frequency: string };
    nonFinancial: string[];
  };
}

export interface IEligibilityCheck extends Document {
  userId: string;
  profileId: mongoose.Types.ObjectId;
  results: SchemeResult[];
  totalEligible: number;
  totalBenefits: number;
  processingTime: number;
  cacheHit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const citationSchema = new Schema({
  page: Number,
  paragraph: Number,
  text: String,
  documentUrl: String,
}, { _id: false });

const schemeResultSchema = new Schema({
  schemeId: String,
  schemeName: String,
  isEligible: Boolean,
  confidence: Number,
  reasoning: String,
  citations: [citationSchema],
  benefits: {
    financial: { amount: Number, type: String, frequency: String },
    nonFinancial: [String],
  },
}, { _id: false });

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
  { timestamps: true, collection: 'eligibility_checks' }
);

export const EligibilityCheck = mongoose.model<IEligibilityCheck>('EligibilityCheck', eligibilityCheckSchema);