import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Scheme {
  id: string;
  schemeId: string;
  name: { en: string; hi: string };
  ministry: string;
  benefits: {
    financial: { amount: number; frequency: string };
    nonFinancial: string[];
  };
  eligibilityRules: {
    minLandholding?: number;
    maxLandholding?: number;
  };
  requiredDocuments: string[];
}

interface ComparisonState {
  selectedSchemes: Scheme[];
}

const initialState: ComparisonState = {
  selectedSchemes: [],
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<Scheme>) => {
      if (state.selectedSchemes.length < 3 && 
          !state.selectedSchemes.find(s => s.id === action.payload.id)) {
        state.selectedSchemes.push(action.payload);
      }
    },
    removeFromComparison: (state, action: PayloadAction<string>) => {
      state.selectedSchemes = state.selectedSchemes.filter(s => s.id !== action.payload);
    },
    clearComparison: (state) => {
      state.selectedSchemes = [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;