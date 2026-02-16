import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema({
  userId: { type: String, required: true },
  schemeId: { type: String, required: true },
  schemeName: { type: String, required: true },
  applicationId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'disbursed'],
    default: 'submitted',
  },
  submittedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  timeline: [{
    status: String,
    timestamp: Date,
    notes: String,
  }],
  documents: [{
    name: String,
    uploadedAt: Date,
    status: { type: String, enum: ['pending', 'verified', 'rejected'] },
  }],
  officerNotes: String,
}, { timestamps: true });

export const Application = mongoose.model('Application', applicationSchema);

export const applicationTrackerService = {
  async createApplication(userId: string, schemeId: string, schemeName: string): Promise<any> {
    const applicationId = `APP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const application = await Application.create({
      userId,
      schemeId,
      schemeName,
      applicationId,
      status: 'submitted',
      timeline: [{
        status: 'submitted',
        timestamp: new Date(),
        notes: 'Application submitted successfully',
      }],
    });

    return application;
  },

  async updateApplicationStatus(applicationId: string, newStatus: string, notes?: string): Promise<any> {
    const application = await Application.findOne({ applicationId });

    if (!application) {
      throw new Error('Application not found');
    }

    application.status = newStatus as any;
    application.lastUpdated = new Date();
    application.timeline.push({
      status: newStatus,
      timestamp: new Date(),
      notes: notes || `Status updated to ${newStatus}`,
    });

    await application.save();
    return application;
  },

  async getApplicationsByUser(userId: string): Promise<any[]> {
    return Application.find({ userId }).sort({ submittedAt: -1 });
  },

  async getApplicationById(applicationId: string): Promise<any> {
    return Application.findOne({ applicationId });
  },
};  