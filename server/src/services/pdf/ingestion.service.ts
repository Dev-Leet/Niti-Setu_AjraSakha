import { SchemeChunk } from '@models/SchemeChunk.model.js';
import { SuggestedRule } from '@models/SuggestedRule.model.js';
import { chunkerService } from './chunker.service.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { ruleExtractorService } from '@services/eligibility/ruleExtractor.service.js';

export const pdfIngestionService = {
  async ingestSchemePDF(schemeId: string, schemeName: string, pdfBuffer: Buffer): Promise<void> {
    await SchemeChunk.deleteMany({ schemeId });
    await SuggestedRule.deleteMany({ schemeId });
    
    const chunks = await chunkerService.chunkPDF(pdfBuffer);
    
    const texts = chunks.map(c => c.text);
    const embeddings = await embeddingsService.embedTexts(texts);
    
    const documents = chunks.map((chunk, idx) => ({
      schemeId,
      schemeName,
      chunkText: chunk.text,
      sectionTitle: chunk.sectionTitle,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      embedding: embeddings[idx],
      isEligibilitySection: chunk.isEligibilitySection,
      metadata: chunk.metadata,
    }));
    
    const insertedChunks = await SchemeChunk.insertMany(documents);
    
    const allExtractedRules: any[] = [];
    
    for (let i = 0; i < insertedChunks.length; i++) {
      const chunk = insertedChunks[i];
      const rules = ruleExtractorService.extractRules(
        chunk.chunkText,
        chunk._id.toString(),
        chunk.pageNumber
      );
      
      allExtractedRules.push(...rules);
    }
    
    if (allExtractedRules.length > 0) {
      const overallConfidence = ruleExtractorService.calculateConfidence(allExtractedRules);
      
      await SuggestedRule.create({
        schemeId,
        schemeName,
        rules: allExtractedRules,
        overallConfidence,
        status: 'pending',
      });
    }
  },
};