import mongoose, { Schema, Document } from 'mongoose';

export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  state: string;
  district: string;
  pincode: string;
  landholding: {
    totalArea: number;
    ownershipType: string;
    irrigationType?: string;
  }; 
  cropTypes: string[];
  socialCategory: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  aadharNumber?: string;
  version: number;
}

const farmerProfileSchema = new Schema<IFarmerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/,
    },
    landholding: {
      totalArea: {
        type: Number,
        required: true,
        min: 0,
      },
      ownershipType: {
        type: String,
        required: true,
        enum: ['owned', 'leased', 'shared'],
      },
      irrigationType: String,
    },
    cropTypes: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, 'At least one crop required'],
    },
    socialCategory: {
      type: String,
      required: true,
      enum: ['General', 'SC', 'ST', 'OBC'],
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    aadharNumber: {
      type: String,
      match: /^\d{12}$/,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    collection: 'farmer_profiles',
  }
);

export const FarmerProfile = mongoose.model<IFarmerProfile>('FarmerProfile', farmerProfileSchema);