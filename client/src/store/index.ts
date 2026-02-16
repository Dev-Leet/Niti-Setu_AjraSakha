import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import eligibilityReducer from './slices/eligibilitySlice';
import schemeReducer from './slices/schemeSlice';
import uiReducer from './slices/uiSlice';
import comparisonReducer from './slices/comparisonSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    eligibility: eligibilityReducer,
    scheme: schemeReducer,
    ui: uiReducer,
    comparison: comparisonReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;