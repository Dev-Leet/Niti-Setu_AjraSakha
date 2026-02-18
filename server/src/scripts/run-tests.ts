import mongoose from 'mongoose';
import { matcherService } from '@services/eligibility/matcher.service.js';
import { TEST_FARMER_PROFILES } from '../data/test-farmer-profiles.js';
import { logger } from '@utils/logger.js';
import dotenv from 'dotenv';
 
dotenv.config();

interface TestResult {
  farmerId: string;
  farmerName: string;
  schemeId: string;
  eligible: boolean;
  confidence: number;
  processingTimeMs: number;
  explanation: string;
  error?: string;
}

const SCHEME_IDS = ['pm-kisan', 'pm-kusum', 'agri-infra-fund'];

async function runTests(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_URI!);
  logger.info('Starting eligibility tests with 10 real farmer profiles');

  const results: TestResult[] = [];

  for (const farmer of TEST_FARMER_PROFILES) {
    for (const schemeId of SCHEME_IDS) {
      const start = Date.now();
      try {
        const result = await matcherService.checkEligibility(
          {
            state: farmer.state,
            district: farmer.district,
            landholding: farmer.landholding,
            cropType: farmer.cropType,
            socialCategory: farmer.socialCategory,
          },
          schemeId
        );

        // result may be a cached object with unknown shape; narrow it before accessing properties
        const r: any = result as any;

        results.push({
          farmerId: farmer.id,
          farmerName: farmer.fullName,
          schemeId,
          eligible: Boolean(r.eligible),
          confidence: typeof r.confidence === 'object' ? r.confidence.combinedConfidence ?? 0 : (r.confidence ?? 0),
          processingTimeMs: Date.now() - start,
          explanation: r.explanation ?? '',
        });

        logger.info(`${farmer.fullName} x ${schemeId}: ${r.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'} (${Date.now() - start}ms)`);
      } catch (error: unknown) {
        const err = error as Error;
        results.push({
          farmerId: farmer.id,
          farmerName: farmer.fullName,
          schemeId,
          eligible: false,
          confidence: 0,
          processingTimeMs: Date.now() - start,
          explanation: '',
          error: err.message,
        });
        logger.error(`Error for ${farmer.fullName} x ${schemeId}: ${err.message}`);
      }
    }
  }

  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTimeMs, 0) / results.length;
  const slowTests = results.filter(r => r.processingTimeMs > 10000);
  const errors = results.filter(r => r.error);

  logger.info('\n=== TEST RESULTS ===');
  logger.info(`Total tests: ${results.length}`);
  logger.info(`Avg processing time: ${Math.round(avgProcessingTime)}ms`);
  logger.info(`Tests exceeding 10s: ${slowTests.length}`);
  logger.info(`Errors: ${errors.length}`);

  await mongoose.disconnect();
}

runTests().catch(console.error);