import { Scheme, SavedScheme } from '@models/index.js';
import { AppError } from '@utils/index.js';
import { cacheService } from './cache.service.js';
 
export const schemeService = {
  async getAll(filters: { state?: string; ministry?: string; category?: string }) {
    const query: any = { status: 'active' };

    if (filters.state) query['eligibilityRules.allowedStates'] = filters.state;
    if (filters.ministry) query.ministry = filters.ministry;
    if (filters.category) query.category = filters.category;

    const cacheKey = JSON.stringify(filters);
    const cached = await cacheService.getSchemes(cacheKey);
    if (cached) return cached;

    const schemes = await Scheme.find(query).select('-pdfDocuments');
    await cacheService.setSchemes(cacheKey, schemes);

    return schemes;
  },

  async getById(schemeId: string) {
    const cached = await cacheService.getScheme(schemeId);
    if (cached) return cached;

    const scheme = await Scheme.findOne({ schemeId });
    if (!scheme) {
      throw new AppError('Scheme not found', 404);
    }

    await cacheService.setScheme(schemeId, scheme);
    return scheme;
  },

  async saveScheme(userId: string, schemeId: string, notes?: string) {
    const scheme = await Scheme.findOne({ schemeId });
    if (!scheme) {
      throw new AppError('Scheme not found', 404);
    }

    const saved = await SavedScheme.findOneAndUpdate(
      { userId, schemeId },
      { notes, userId, schemeId },
      { upsert: true, new: true }
    );

    return saved;
  },

  async getSavedSchemes(userId: string) {
  const saved = await SavedScheme.find({ userId });
  const schemeIds = saved.map((s) => s.schemeId);
  const schemes = await Scheme.find({ schemeId: { $in: schemeIds } });
  return schemes;
},
};