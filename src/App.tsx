import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { actions as cityModalActions } from './features/addCityModalSlice';
import { getCityWeather, updateCities } from './features/weatherSlice';
import { Autocomplete, Box, debounce, Modal, TextField } from '@mui/material';
import { ModalContent, StyledBackdrop } from './components/ModalContent';
import { Navigation } from './components/Navigation';
import { Outlet } from 'react-router-dom';
import { useJsApiLoader, LoadScriptProps } from '@react-google-maps/api';
import { normalizeCity } from './utils/normalizeCity';
import { CityExistsModal } from './components/CityExistsModal';
import { X } from 'lucide-react';

const libraries: LoadScriptProps['libraries'] = ['places'];

function App() {
  const { isOpened, newCity } = useAppSelector((state) => state.cityModal);
  const { cities } = useAppSelector((state) => state.weather);
  const [autocompleteCities, setAutocompleteCities] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [isCityExists, setIsCityExists] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY || '',
    libraries,
    language: 'uk',
  });

  useEffect(() => {
    dispatch(getCityWeather());
  }, [dispatch]);

  const updateAutocompleteCities = useCallback(
    debounce((newCity: string) => {
      if (newCity.trim() && isLoaded) {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          { input: newCity, types: ['(cities)'] },
          (predictions, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              const cities = predictions.map(
                (prediction) => prediction.description,
              );
              setAutocompleteCities(cities);
            }
          },
        );
      }
    }, 300),
    [isLoaded],
  );

  const handleModalClose = () => {
    dispatch(cityModalActions.reset());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const city = data.get('city') as string;

    const normalizedCity = normalizeCity(city);

    const normalizedCities = cities.map((c) => normalizeCity(c));

    if (normalizedCities.includes(normalizedCity)) {
      setIsCityExists(true);
      handleModalClose();

      return;
    }

    handleModalClose();
    dispatch(updateCities([...cities, city]));
  };

  const onNewCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    const normalizedNewCity = normalizeCity(newCity);

    const cityExists = cities.some(
      (city) => normalizeCity(city) === normalizedNewCity,
    );

    if (!cityExists) {
      dispatch(cityModalActions.changeNewCity(newCity));
      updateAutocompleteCities(newCity);
    }
  };

  const handleCloseCityExistsModal = () => {
    setIsCityExists(false);
  };

  return (
    <div className="max-w-[1280px] mx-auto pb-10">
      <div className="app">
        <Navigation />
        <Outlet />
        {isCityExists && (
          <CityExistsModal onClose={handleCloseCityExistsModal} />
        )}

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={isOpened}
          className="city-modal"
          onClose={handleModalClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px]">
            <div className="flex justify-between">
              <h2 id="unstyled-modal-title" className="modal-title">
                Enter city name
              </h2>
              <button
                className="absolute right-3 top-3 cursor-pointer"
                onClick={handleModalClose}
              >
                <X />
              </button>
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Autocomplete
                fullWidth
                id="combo-box-demo"
                options={autocompleteCities}
                renderInput={(params) => (
                  <TextField
                    value={newCity}
                    onChange={onNewCityChange}
                    {...params}
                    label="City"
                    fullWidth
                    name="city"
                  />
                )}
              />
            </Box>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default App;
