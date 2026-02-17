// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface Citation {
//   page: number;
//   paragraph: number;
//   text: string;
//   documentUrl: string;
// }

// interface EligibilityResult {
//   schemeId: string;
//   schemeName: string;
//   isEligible: boolean;
//   confidence: number;
//   reasoning: string;
//   citations: Citation[];
//   benefits: {
//     financial: { amount: number; type: string; frequency: string };
//     nonFinancial: string[];
//   };
// }

// interface EligibilityCheck {
//   _id: string;
//   userId: string;
//   results: EligibilityResult[];
//   totalEligible: number;
//   processingTime: number;
//   createdAt: string;
// }

// interface EligibilityState {
//   checks: EligibilityCheck[];
//   currentCheck: EligibilityCheck | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: EligibilityState = {
//   checks: [],
//   currentCheck: null,
//   loading: false,
//   error: null,
// };

// export const checkEligibility = createAsyncThunk(
//   'eligibility/check',
//   async (profile: { state: string; district: string; landholding: number; cropType: string; socialCategory: string; schemeId: string }) => {
//     const token = localStorage.getItem('accessToken');
//     const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/eligibility/check`, profile, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return data.data;
//   }
// );

// export const fetchCheckHistory = createAsyncThunk('eligibility/history', async () => {
//   const token = localStorage.getItem('accessToken');
//   const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/eligibility/history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data.data.checks;
// });

// export const fetchCheckById = createAsyncThunk('eligibility/fetchById', async (checkId: string) => {
//   const token = localStorage.getItem('accessToken');
//   const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/eligibility/${checkId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data.data;
// });

// const eligibilitySlice = createSlice({
//   name: 'eligibility',
//   initialState,
//   reducers: {
//     clearCurrentCheck: (state) => {
//       state.currentCheck = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(checkEligibility.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkEligibility.fulfilled, (state, action: PayloadAction<EligibilityCheck>) => {
//         state.loading = false;
//         state.currentCheck = action.payload;
//         state.checks.unshift(action.payload);
//       })
//       .addCase(checkEligibility.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Check failed';
//       })
//       .addCase(fetchCheckHistory.fulfilled, (state, action: PayloadAction<EligibilityCheck[]>) => {
//         state.checks = action.payload;
//       })
//       .addCase(fetchCheckById.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCheckById.fulfilled, (state, action: PayloadAction<EligibilityCheck>) => {
//         state.loading = false;
//         state.currentCheck = action.payload;
//       })
//       .addCase(fetchCheckById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch check';
//       });
//   },
// });

// export const { clearCurrentCheck } = eligibilitySlice.actions;
// export default eligibilitySlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/api';

interface Citation {
  text: string;
  page: number;
  confidence: number;
  section?: string;
}

interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  ministry: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  citations: Citation[];
}

interface EligibilityCheck {
  _id: string;
  userId: string;
  results: EligibilityResult[];
  createdAt: string;
  processingTime: number;
}

interface EligibilityState {
  currentCheck: EligibilityCheck | null;
  history: EligibilityCheck[];
  loading: boolean;
  error: string | null;
}

const initialState: EligibilityState = {
  currentCheck: null,
  history: [],
  loading: false,
  error: null,
};

export const fetchCheckById = createAsyncThunk(
  'eligibility/fetchCheckById',
  async (checkId: string) => {
    const response = await apiClient.get(`/eligibility/${checkId}`);
    return response.data.data;
  }
);

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
      .addCase(fetchCheckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheck = action.payload;
      })
      .addCase(fetchCheckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch check';
      });
  },
});

export const { clearCurrentCheck } = eligibilitySlice.actions;
export default eligibilitySlice.reducer;