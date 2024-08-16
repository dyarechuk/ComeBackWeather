import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getWeatherInfo } from '../utils/fetchData';
import { CityDetail } from '../types/CityDetail';
import { normalizeCity } from '../utils/normalizeCity';

interface InitialState {
  cities: string[];
  cityDetails: CityDetail[];
  loading: boolean;
  error: string;
  isEditing: boolean;
}

const loadCitiesFromLocalStorage = (): string[] => {
  try {
    const cities = localStorage.getItem('cities');
    return cities ? JSON.parse(cities) : [];
  } catch (error) {
    console.error('Failed to load cities from localStorage', error);
    return [];
  }
};

const saveCitiesToLocalStorage = (cities: string[]) => {
  try {
    localStorage.setItem('cities', JSON.stringify(cities));
  } catch (error) {
    console.error('Failed to save cities to localStorage', error);
  }
};

const initialState: InitialState = {
  cities: loadCitiesFromLocalStorage(),
  cityDetails: [],
  loading: true,
  error: '',
  isEditing: false,
};

export const getCityWeather = createAsyncThunk(
  'weather/getCityWeather',
  async () => {
    const cities = loadCitiesFromLocalStorage();
    const citiesWeatherInfo = [] as CityDetail[];

    for (let i = 0; i < cities.length; i++) {
      try {
        const response = await getWeatherInfo(cities[i]);
        const data = response.data;
        const cityParts = cities[i].split(', ');
        const cityName = cityParts[0];
        const countryName = cityParts[1] || 'Unknown';

        citiesWeatherInfo.push({
          name: `${cityName}, ${countryName}`,
          currentWeather: data,
        });
      } catch (err) {
        console.error('Error fetching weather info:', err);
      }
    }

    return citiesWeatherInfo;
  },
);

export const updateCities = createAsyncThunk(
  'weather/updateCities',
  async (updatedCities: string[], { dispatch, getState }) => {
    const state = getState() as { weather: InitialState };
    const existingCities = state.weather.cities.map((city) =>
      normalizeCity(city),
    );

    const uniqueCities = updatedCities.filter(
      (city) => !existingCities.includes(normalizeCity(city)),
    );

    if (uniqueCities.length > 0) {
      const newCities = [...existingCities, ...uniqueCities];
      saveCitiesToLocalStorage(newCities);
      dispatch(getCityWeather());
      return newCities;
    }

    return existingCities;
  },
);

export const removeCity = createAsyncThunk(
  'weather/removeCity',
  async (cityToRemove: string, { dispatch, getState }) => {
    const state = getState() as { weather: InitialState };
    const existingCities = state.weather.cities.map((city) =>
      normalizeCity(city),
    );

    const newCities = existingCities.filter(
      (city) => city !== normalizeCity(cityToRemove),
    );

    saveCitiesToLocalStorage(newCities);
    dispatch(getCityWeather());
    return newCities;
  },
);

export const refreshCityWeather = createAsyncThunk(
  'weather/refreshCityWeather',
  async (cityName: string) => {
    try {
      const response = await getWeatherInfo(cityName);
      const data = response.data;
      const cityParts = cityName.split(', ');
      const cityNameNormalized = cityParts[0];
      const countryName = cityParts[1] || 'Unknown';

      return {
        name: `${cityNameNormalized}, ${countryName}`,
        currentWeather: data,
      };
    } catch (err) {
      console.error('Error fetching weather info:', err);
      throw err;
    }
  },
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    changeIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCityWeather.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCityWeather.fulfilled, (state, action) => {
      state.cityDetails = action.payload;
      state.cities = action.payload.map(
        (cityDetail: CityDetail) => cityDetail.name,
      );
      state.loading = false;
    });
    builder.addCase(getCityWeather.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to fetch weather information';
    });

    builder.addCase(updateCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCities.fulfilled, (state, action) => {
      state.cities = action.payload;
      state.loading = false;
    });
    builder.addCase(updateCities.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to update cities';
    });
    builder.addCase(refreshCityWeather.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(refreshCityWeather.fulfilled, (state, action) => {
      const refreshedCity = action.payload;
      const index = state.cityDetails.findIndex(
        (city) => city.name === refreshedCity.name,
      );
      if (index >= 0) {
        state.cityDetails[index] = refreshedCity;
      }
      state.loading = false;
    });
    builder.addCase(refreshCityWeather.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to refresh weather information';
    });
    builder.addCase(removeCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeCity.fulfilled, (state, action) => {
      state.cities = action.payload;
      state.loading = false;
    });
    builder.addCase(removeCity.rejected, (state) => {
      state.loading = false;
      state.error = 'Failed to remove city';
    });
  },
});

export default weatherSlice.reducer;
export const actions = { ...weatherSlice.actions };
