// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { api } from '../services/api';
// import productReducer from './productSlice';

// // Configure the Redux store
// export const store = configureStore({
//   reducer: {
//     products: productReducer,
//     [api.reducerPath]: api.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// });

// // Set up listeners for RTK Query
// setupListeners(store.dispatch);

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import { api } from "../services/api";
import authReducer from "./authSlice"; // ADD THIS
import productReducer from "./productSlice";
import forecastReducer from "./forecastSlice";
import uiReducer from "./uiSlice";
import filtersReducer from "./filtersSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "products", "forecast", "filters"], // ADD auth to whitelist
  blacklist: ["ui"],
};

const rootReducer = combineReducers({
  auth: authReducer, // ADD THIS
  products: productReducer,
  forecast: forecastReducer,
  ui: uiReducer,
  filters: filtersReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);
