import mongoose, { Schema } from 'mongoose';

const suggestedRuleSchema = new Schema({
  schemeId: { type: String, required: true, index: true },
  schemeName: { type: String, required: true },
  rules: [{
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: Schema.Types.Mixed,
    rawText: String,
    confidence: { type: Number, required: true },
    sourceChunkId: { type: Schema.Types.ObjectId, ref: 'SchemeChunk' },
    pageNumber: Number,
  }],
  overallConfidence: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: String,
  reviewedAt: Date,
}, { timestamps: true });

export const SuggestedRule = mongoose.model('SuggestedRule', suggestedRuleSchema);