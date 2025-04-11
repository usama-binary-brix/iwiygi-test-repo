'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import { persistReducer, persistStore } from 'redux-persist';
import { api } from './api'; 
import userReducer from './Slices/userSlice'; 
import adsReducer from './Slices/adsSlice'
import savedListingsReducer from './Slices/listingsSlice'
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'ads','savedListing'],
};

const rootReducer = combineReducers({
  user: userReducer,
  ads: adsReducer,
  savedListing:savedListingsReducer,
  [api.reducerPath]: api.reducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
