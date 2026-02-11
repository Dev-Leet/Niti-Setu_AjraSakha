import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import eligibilityReducer from './slices/eligibilitySlice';
import schemeReducer from './slices/schemeSlice';
import uiReducer from './slices/uiSlice';
import comparisonReducer from './slices/comparisonSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    eligibility: eligibilityReducer,
    scheme: schemeReducer,
    ui: uiReducer,
    comparison: comparisonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['voice/setAudioBlob'],
        ignoredPaths: ['voice.audioBlob'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;