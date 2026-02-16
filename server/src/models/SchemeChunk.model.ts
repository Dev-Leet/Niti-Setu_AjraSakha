import mongoose, { Schema } from 'mongoose';

const schemeChunkSchema = new Schema({
  schemeId: { type: String, required: true, index: true },
  schemeName: { 
    en: { type: String, required: true },
    hi: String,
    mr: String,
    ta: String,
  },
  chunkText: {
    en: { type: String, required: true },
    hi: String,
    mr: String,
    ta: String,
  },
  sectionTitle: {
    en: String,
    hi: String,
    mr: String,
    ta: String,
  },
  pageNumber: { type: Number, required: true },
  chunkIndex: { type: Number, required: true },
  embedding: { type: [Number], required: true },
  isEligibilitySection: { type: Boolean, default: false },
  metadata: {
    tokenCount: Number,
    startPage: Number,
    endPage: Number,
  },
}, { timestamps: true });

schemeChunkSchema.index({ schemeId: 1, chunkIndex: 1 });
schemeChunkSchema.index({ isEligibilitySection: 1 });
schemeChunkSchema.index({ embedding: "2dsphere" });

export const SchemeChunk = mongoose.model('SchemeChunk', schemeChunkSchema);