import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes GET requests', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(axios.get).mockResolvedValue({ data: mockData });

    const result = await axios.get('/test');
    expect(result.data).toEqual(mockData);
  });
});