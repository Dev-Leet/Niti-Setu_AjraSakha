import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  resource: { type: String, required: true, index: true },
  resourceId: String,
  changes: Schema.Types.Mixed,
  metadata: { type: Schema.Types.Mixed, default: {} },
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now, index: true },
}, { collection: 'audit_logs' });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);