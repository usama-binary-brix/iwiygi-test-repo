import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default storage

interface AdsState {
  ads: any[];
}

const initialState: AdsState = {
  ads: [],
};

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setAds: (state, action: PayloadAction<any[]>) => {
      state.ads = action.payload;
    },
    clearAds: (state) => {
      state.ads = [];
    },
  },
});

export const { setAds, clearAds } = adsSlice.actions;

const persistConfig = {
  key: "ads",
  storage,
};

export default persistReducer(persistConfig, adsSlice.reducer);
