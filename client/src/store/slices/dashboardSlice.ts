import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DashboardStats {
  totalChecks: number;
  eligibleSchemes: number;
  savedSchemes: number;
  recentChecks: Array<{
    id: string;
    schemeName: string;
    date: string;
    eligible: boolean;
  }>;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async () => {
  const token = localStorage.getItem('accessToken');
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export default dashboardSlice.reducer;