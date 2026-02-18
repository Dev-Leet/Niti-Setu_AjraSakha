import axios from 'axios';
import { logger } from '@utils/logger.js';

const OGD_BASE_URL = 'https://api.data.gov.in';
const OGD_API_KEY = process.env.OGD_API_KEY || '';

interface OGDRecord {
  [key: string]: string | number | boolean;
}

export const ogdApiService = {
  async searchAgriculturalSchemes(query: string): Promise<OGDRecord[]> {
    try {
      const response = await axios.get(`${OGD_BASE_URL}/resource`, {
        params: {
          api_key: OGD_API_KEY,
          format: 'json',
          q: query,
        },
        timeout: 10000,
      });

      return response.data.records || [];
    } catch (error: unknown) {
      logger.error('OGD API search error:', (error as Error).message);
      return [];
    }
  },

  async getDatasetById(resourceId: string): Promise<OGDRecord | null> {
    try {
      const response = await axios.get(`${OGD_BASE_URL}/resource/${resourceId}`, {
        params: {
          api_key: OGD_API_KEY,
          format: 'json',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error: unknown) {
      logger.error('OGD API fetch error:', (error as Error).message);
      return null;
    }
  },
};