import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  schemeId: string;
  name: {
    en: string;
    hi: string;
    mr?: string;
  };
  description: {
    en: string;
    hi: string;
    mr?: string;
  };
  ministry: string;
  category: string;
  status: 'active' | 'inactive' | 'archived';
  eligibilityRules: {
    minLandholding?: number;
    maxLandholding?: number;
    allowedStates?: string[];
    allowedCategories?: string[];
    allowedCrops?: string[];
    minAge?: number;
    maxAge?: number;
  };
  benefits: {
    financial: {
      amount: number;
      type: string;
      frequency: string;
      disbursementMode: string;
    };
    nonFinancial: string[];
  };
  requiredDocuments: string[];
  applicationDeadline?: Date;
  officialUrl: string;
  pdfDocuments: Array<{
    url: string;
    fileName: string;
    uploadDate: Date;
    version: string;
  }>;
}

const schemeSchema = new Schema<IScheme>(
  {
    schemeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: String,
    },
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: String,
    },
    ministry: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      index: true,
    },
    eligibilityRules: {
      minLandholding: Number,
      maxLandholding: Number,
      allowedStates: [String],
      allowedCategories: [String],
      allowedCrops: [String],
      minAge: Number,
      maxAge: Number,
    },
    benefits: {
      financial: {
        amount: { type: Number, required: true },
        type: { type: String, required: true },
        frequency: { type: String, required: true },
        disbursementMode: { type: String, required: true },
      },
      nonFinancial: [String],
    },
    requiredDocuments: {
      type: [String],
      required: true,
    },
    applicationDeadline: Date,
    officialUrl: {
      type: String,
      required: true,
    },
    pdfDocuments: [
      {
        url: String,
        fileName: String,
        uploadDate: Date,
        version: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'schemes',
  }
);

export const Scheme = mongoose.model<IScheme>('Scheme', schemeSchema);