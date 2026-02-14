import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedScheme extends Document {
  userId: mongoose.Types.ObjectId;
  schemeId: string;
  notes?: string;
  reminderDate?: Date;
}
 
const savedSchemeSchema = new Schema<ISavedScheme>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schemeId: {
      type: String,
      required: true,
      index: true,
    },
    notes: String,
    reminderDate: Date,
  },
  {
    timestamps: true,
    collection: 'saved_schemes',
  }
);

savedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

export const SavedScheme = mongoose.model<ISavedScheme>('SavedScheme', savedSchemeSchema);