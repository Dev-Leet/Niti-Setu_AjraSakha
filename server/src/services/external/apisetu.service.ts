import axios from 'axios';
import { logger } from '@utils/logger.js';

const APISETU_BASE_URL = 'https://apisetu.gov.in/api';

export const apisetuService = {
  async getSchemeDetails(schemeId: string): Promise<any> {
    try {
      const response = await axios.get(`${APISETU_BASE_URL}/schemes/${schemeId}`, {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 15000,
      });

      return response.data;
    } catch (error: any) {
      logger.error('APISetu fetch error:', error.message);
      return null;
    }
  },

  async searchSchemes(params: { sector?: string; ministry?: string; state?: string }): Promise<any[]> {
    try {
      const response = await axios.get(`${APISETU_BASE_URL}/schemes`, {
        params,
        headers: {
          'Accept': 'application/json',
        },
        timeout: 15000,
      });

      return response.data.schemes || [];
    } catch (error: any) {
      logger.error('APISetu search error:', error.message);
      return [];
    }
  },
};