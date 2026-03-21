import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import type { WebStorage } from "redux-persist/lib/types";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { BookingItem } from "../../interface";
import bookReducer from "./features/bookSlice";

function createPersistStorage(): WebStorage {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return {
      getItem(_key: string) {
        return Promise.resolve(null);
      },
      setItem(_key: string, _value: string) {
        return Promise.resolve();
      },
      removeItem(_key: string) {
        return Promise.resolve();
      },
    };
  }

  return createWebStorage("local");
}

const storage = createPersistStorage();

const persistConfig = {
  key: "rootPersist",
  storage,
};

const rootReducer = combineReducers({
  bookSlice: bookReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  bookSlice: {
    bookItems: BookingItem[];
  };
};

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;