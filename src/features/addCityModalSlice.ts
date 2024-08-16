import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isOpened: boolean;
  newCity: string;
}

const initialState: InitialState = {
  isOpened: false,
  newCity: '',
};

const addCityModalSlice = createSlice({
  name: 'cityModal',
  initialState,
  reducers: {
    reset: () => initialState,
    changeNewCity: (state, action: PayloadAction<string>) => {
      state.newCity = action.payload;
    },
    changeModalState: (state, action: PayloadAction<boolean>) => {
      state.isOpened = action.payload;
    },
  },
});

export const actions = { ...addCityModalSlice.actions };
export const addCityModalReducer = addCityModalSlice.reducer;
