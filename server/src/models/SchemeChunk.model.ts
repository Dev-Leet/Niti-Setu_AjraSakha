import mongoose, { Schema } from 'mongoose';

const schemeChunkSchema = new Schema({
  schemeId: { type: String, required: true, index: true },
  schemeName: { type: String, required: true },
  chunkText: { type: String, required: true },
  sectionTitle: { type: String },
  pageNumber: { type: Number, required: true },
  chunkIndex: { type: Number, required: true },
  embedding: { type: [Number], required: true },
  isEligibilitySection: { type: Boolean, default: false },
  metadata: {
    paragraphNumber: Number,
    confidence: Number,
  },
}, { timestamps: true });

schemeChunkSchema.index({ schemeId: 1, chunkIndex: 1 });
schemeChunkSchema.index({ isEligibilitySection: 1 });

export const SchemeChunk = mongoose.model('SchemeChunk', schemeChunkSchema);