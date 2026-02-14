import { Analytics } from '@models/index.js';
import { EligibilityCheck } from '@models/index.js';
import { User } from '@models/index.js';

export const analyticsService = {
  async trackEvent(eventType: string, userId: string, metadata: any) {
    await Analytics.create({
      eventType,
      userId,
      metadata,
      timestamp: new Date(),
    });
  },

  async getUserStats(userId: string) {
    const totalChecks = await EligibilityCheck.countDocuments({ userId });
    const recentCheck = await EligibilityCheck.findOne({ userId }).sort({ createdAt: -1 });

    return { 
      totalChecks,
      lastCheckDate: recentCheck?.createdAt,
      totalEligibleSchemes: recentCheck?.totalEligible || 0,
    };
  },

  async getSystemStats() {
    const totalUsers = await User.countDocuments();
    const totalChecks = await EligibilityCheck.countDocuments();
    const avgProcessingTime = await EligibilityCheck.aggregate([
      { $group: { _id: null, avg: { $avg: '$processingTime' } } },
    ]);

    return {
      totalUsers,
      totalChecks,
      avgProcessingTime: avgProcessingTime[0]?.avg || 0,
    };
  },
};