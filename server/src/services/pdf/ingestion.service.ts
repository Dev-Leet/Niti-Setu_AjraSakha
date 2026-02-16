import { SchemeChunk } from '@models/SchemeChunk.model.js';
import { SuggestedRule } from '@models/SuggestedRule.model.js';
import { chunkerService } from './chunker.service.js';
import { embeddingsService } from '@services/ml/embeddings.service.js';
import { ruleExtractorService } from '@services/eligibility/ruleExtractor.service.js';
import { translationService } from '@services/translation/translation.service.js';

export const pdfIngestionService = {
  async ingestSchemePDF(schemeId: string, schemeName: string, pdfBuffer: Buffer, translateContent = true): Promise<void> => {
    await SchemeChunk.deleteMany({ schemeId });
    await SuggestedRule.deleteMany({ schemeId });
    
    const chunks = await chunkerService.chunkPDF(pdfBuffer);
    
    const texts = chunks.map(c => c.text);
    const embeddings = await embeddingsService.embedTexts(texts);
    
    const translatedSchemeNames = translateContent ? await translationService.translateSchemeContent({ en: schemeName }) : { en: schemeName, hi: '', mr: '', ta: '' };
    
    const documents: Array<{
      schemeId: string;
      schemeName: { en: string; hi: string; mr: string; ta: string };
      chunkText: { en: string; hi: string; mr: string; ta: string };
      sectionTitle: { en: string; hi: string; mr: string; ta: string };
      pageNumber: number;
      chunkIndex: number;
      embedding: number[];
      isEligibilitySection: boolean;
      metadata: { tokenCount?: number; startPage?: number; endPage?: number };
    }> = [];
    
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      
      const translatedContent = translateContent 
        ? await translationService.translateSchemeContent({ en: chunk.text })
        : { en: chunk.text, hi: '', mr: '', ta: '' };
      
      const translatedTitle = chunk.sectionTitle && translateContent
        ? await translationService.translateSchemeContent({ en: chunk.sectionTitle })
        : { en: chunk.sectionTitle || '', hi: '', mr: '', ta: '' };

      documents.push({
        schemeId,
        schemeName: translatedSchemeNames,
        chunkText: translatedContent,
        sectionTitle: translatedTitle,
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        embedding: embeddings[idx],
        isEligibilitySection: chunk.isEligibilitySection,
        metadata: chunk.metadata,
      });
    }
    
    const savedDocs = await SchemeChunk.insertMany(documents);
    
    const allExtractedRules: Array<{
      field: string;
      operator: string;
      value: string | number | string[];
      rawText: string;
      confidence: number;
      sourceChunkId?: string;
      pageNumber?: number;
    }> = [];
    
    for (const doc of savedDocs) {
      const rules = ruleExtractorService.extractRules(
        doc.chunkText.en,
        doc._id?.toString(),
        doc.pageNumber
      );
      
      allExtractedRules.push(...rules);
    }
    
    if (allExtractedRules.length > 0) {
      const overallConfidence = ruleExtractorService.calculateConfidence(allExtractedRules);
      
      await SuggestedRule.create({
        schemeId,
        schemeName: schemeName,
        rules: allExtractedRules,
        overallConfidence,
        status: 'pending',
      });
    }
  },
};