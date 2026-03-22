import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, _value: string) {
      return Promise.resolve()
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== 'undefined'
    ? require('redux-persist/lib/storage').default
    : createNoopStorage()

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch