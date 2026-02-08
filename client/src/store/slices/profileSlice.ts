import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService, FarmerProfile } from '@services/profile.service';

interface ProfileState {
  profile: FarmerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const createProfile = createAsyncThunk(
  'profile/create',
  async (profileData: Omit<FarmerProfile, 'id'>, { rejectWithValue }) => {
    try {
      return await profileService.create(profileData);
    } catch (error: unknown) {
        const message =
        error instanceof Error ? error.message : 'Failed to create profile';
        return rejectWithValue(message);
    }
  }
);

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    return await profileService.get();
  } catch (error: unknown) {
        const message =
        error instanceof Error ? error.message : 'Failed to fetch profile';
        return rejectWithValue(message);
    } 
 
});

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData: Partial<FarmerProfile>, { rejectWithValue }) => {
    try {
      return await profileService.update(profileData);
    } catch (error: unknown) {
        const message =
        error instanceof Error ? error.message : 'Failed to update profile';
        return rejectWithValue(message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default profileSlice.reducer;