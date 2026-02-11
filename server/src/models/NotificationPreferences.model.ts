import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationPreferences extends Document {
  userId: string;
  email: {
    eligibilityResults: boolean;
    schemeUpdates: boolean;
    deadlineReminders: boolean;
  };
  sms: {
    eligibilityResults: boolean;
    deadlineReminders: boolean;
  };
  push: {
    eligibilityResults: boolean;
    schemeUpdates: boolean;
  };
}

const preferencesSchema = new Schema<INotificationPreferences>({
  userId: { type: String, required: true, unique: true },
  email: {
    eligibilityResults: { type: Boolean, default: true },
    schemeUpdates: { type: Boolean, default: true },
    deadlineReminders: { type: Boolean, default: true },
  },
  sms: {
    eligibilityResults: { type: Boolean, default: false },
    deadlineReminders: { type: Boolean, default: false },
  },
  push: {
    eligibilityResults: { type: Boolean, default: true },
    schemeUpdates: { type: Boolean, default: false },
  },
}, { timestamps: true });

export const NotificationPreferences = mongoose.model<INotificationPreferences>(
  'NotificationPreferences',
  preferencesSchema
);