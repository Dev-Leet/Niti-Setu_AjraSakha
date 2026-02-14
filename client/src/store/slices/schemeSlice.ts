import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

export default schemeSlice.reducer;