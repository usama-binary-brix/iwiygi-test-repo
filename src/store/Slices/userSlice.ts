import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  accessToken: string | null;
}

const initialState: UserState = {
  user: null,
  accessToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken; // Save the accessToken
    },
    
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null; // Clear the accessToken
    },
    clearAccessToken: (state) => {
      state.accessToken = null; // Clear just the access token if needed
    },
  },
});

export const { setUser, logoutUser, clearAccessToken } = userSlice.actions;

export default userSlice.reducer;
