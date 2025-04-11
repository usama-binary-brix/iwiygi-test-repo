import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default storage

interface Listing {
    listingId: string;
  }
  
  interface SavedListingsState {
    savedListings: Listing[]; // Array of objects
  }
  
  const initialState: SavedListingsState = {
    savedListings: [],
  };

const savedListingsSlice = createSlice({
  name: "savedListing",
  initialState,
  reducers: {
    addSavedListing: (state, action: PayloadAction<Listing>) => {
      state.savedListings.push(action.payload);
    },
    removeSavedListing: (state, action: PayloadAction<string>) => {
      state.savedListings = state.savedListings.filter(
        (item) => item.listingId !== action.payload
      );
    },
  },
});

export const {  addSavedListing, removeSavedListing } = savedListingsSlice.actions;

const persistConfig = {
  key: "savedListing",
  storage,
};

export default persistReducer(persistConfig, savedListingsSlice.reducer);
