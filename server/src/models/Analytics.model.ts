import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  eventType: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    collection: 'analytics',
  }
);

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);