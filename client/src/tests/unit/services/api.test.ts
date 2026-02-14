import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/api.service';
import axios from 'axios';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes GET requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(axios.get).mockResolvedValue({ data: mockData });

    const result = await apiClient.get('/test');
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith('/test', expect.any(Object));
  });

  it('handles errors', async () => {
    const error = new Error('Network error');
    vi.mocked(axios.get).mockRejectedValue(error);

    await expect(apiClient.get('/test')).rejects.toThrow('Network error');
  });
});