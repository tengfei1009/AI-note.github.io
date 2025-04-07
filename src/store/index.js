import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    // 其他 reducers...
  },
});

export default store;