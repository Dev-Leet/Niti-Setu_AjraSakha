import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eligibilityService, EligibilityCheckResponse } from '@services/eligibility.service';
import { CheckHistoryItem } from '@pages/Dashboard/types';

/* interface EligibilityState {
  currentCheck: EligibilityCheckResponse | null;
  history: EligibilityCheckResponse[];
  loading: boolean;
  error: string | null;
} */

interface EligibilityState {
  currentCheck: EligibilityCheckResponse | null;
  history: CheckHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: EligibilityState = {
  currentCheck: null,
  history: [],
  loading: false,
  error: null,
};

export const checkEligibility = createAsyncThunk(
  'eligibility/check',
  async (profileId: string, { rejectWithValue }) => {
    try {
      return await eligibilityService.checkEligibility(profileId);
    } catch (error: unknown) {  
      const message =
        error instanceof Error
          ? error.message
          : 'Eligibility check failed';

      return rejectWithValue(message);
    }
  }
);

export const fetchCheckHistory = createAsyncThunk('eligibility/history', async () => {
  return await eligibilityService.getCheckHistory();
});

const eligibilitySlice = createSlice({
  name: 'eligibility',
  initialState,
  reducers: {
    clearCurrentCheck: (state) => {
      state.currentCheck = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkEligibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEligibility.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheck = action.payload;
      })
      .addCase(checkEligibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCheckHistory.fulfilled, (state, action) => {
        state.history = action.payload.data;
      });
  },
});

export const { clearCurrentCheck } = eligibilitySlice.actions;
export default eligibilitySlice.reducer;