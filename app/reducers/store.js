import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '.';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {},
      immutableCheck: false,
      serializableCheck: false, 
    }),
});

export default store;
