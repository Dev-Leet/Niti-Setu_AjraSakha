/* import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { schemeService, Scheme } from '@services/scheme.service';

interface SchemeFilters {
  state?: string;
  ministry?: string;
  category?: string;
}

interface SchemeState {
  schemes: Scheme[];
  savedSchemes: Scheme[];
  currentScheme: Scheme | null;
  loading: boolean;
  error: string | null;
}
 
const initialState: SchemeState = {
  schemes: [],
  savedSchemes: [],
  currentScheme: null,
  loading: false,
  error: null,
};

export const fetchSchemes = createAsyncThunk('scheme/fetchAll', async (filters?: SchemeFilters) => {
  return await schemeService.getAll(filters);
});

export const fetchSchemeById = createAsyncThunk('scheme/fetchById', async (id: string) => {
  return await schemeService.getById(id);
});

export const saveScheme = createAsyncThunk(
  'scheme/save',
  async ({ schemeId, notes }: { schemeId: string; notes?: string }) => {
    return await schemeService.save(schemeId, notes);
  }
);

export const fetchSavedSchemes = createAsyncThunk('scheme/fetchSaved', async () => {
  return await schemeService.getSaved();
});

const schemeSlice = createSlice({
  name: 'scheme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload.data;
      })
      .addCase(fetchSchemeById.fulfilled, (state, action) => {
        state.currentScheme = action.payload;
      })
      .addCase(fetchSavedSchemes.fulfilled, (state, action) => {
        state.savedSchemes = action.payload;
      });
  },
});

export default schemeSlice.reducer; */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/api';

interface Scheme {
  _id: string;
  name: { en: string; hi: string; mr: string; ta: string };
  ministry: string;
  benefits?: {
    financial?: { amount: number; unit: string };
    description?: string;
  };
  applicationDeadline?: string;
  status: string;
}

interface SchemeState {
  schemes: Scheme[];
  loading: boolean;
  error: string | null;
}

const initialState: SchemeState = {
  schemes: [],
  loading: false,
  error: null,
};

export const fetchSchemes = createAsyncThunk(
  'scheme/fetchSchemes',
  async () => {
    const response = await apiClient.get('/schemes/list');
    return response.data.data.schemes;
  }
);

const schemeSlice = createSlice({
  name: 'scheme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schemes';
      });
  },
  
});

export default schemeSlice.reducer;