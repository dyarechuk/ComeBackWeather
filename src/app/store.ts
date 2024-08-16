import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weatherSlice';
import { addCityModalReducer } from '../features/addCityModalSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    cityModal: addCityModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
