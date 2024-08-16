import React from 'react';
import { City } from '../City/City';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as cityModalActions } from '../../features/addCityModalSlice';
import { CityDetail } from '../../types/CityDetail';
import { refreshCityWeather, removeCity } from '../../features/weatherSlice';

export const AddCity: React.FC = () => {
  const dispatch = useAppDispatch();

  const { cityDetails, isEditing } = useAppSelector((state) => state.weather);

  const handleModalOpen = () => {
    dispatch(cityModalActions.changeModalState(true));
  };

  const handleCityRemove = (cityToRemove: string) => {
    dispatch(removeCity(cityToRemove));
  };

  const handleCityUpdate = (cityToUpdate: string) => {
    dispatch(refreshCityWeather(cityToUpdate));
  };

  return (
    <div className="">
      {cityDetails.length === 0 ? (
        <div className="mx-auto flex flex-col justify-center items-center min-h-[50vh] mt-[130px] max-w-[1280px] w-full border text-white bg-[#3b4460] rounded-2xl">
          <p className="text-xl">No cities added, add a new one?</p>
          <button
            onClick={handleModalOpen}
            className="text-lg mt-4 px-6 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#333333] focus:outline-none border hover:shadow-xl"
          >
            Add City
          </button>
        </div>
      ) : (
        <div className="grid bg-[#3b4460] rounded-2xl grid-cols-1 md:grid-cols-2 gap-10 px-10 py-10 mt-[130px] ">
          {cityDetails.map(
            (city: CityDetail, index: React.Key | null | undefined) => (
              <div
                className={`transition-all duration-300 ${
                  !isEditing && 'hover:opacity-70 hover:scale-105'
                }`}
                key={index}
              >
                <City
                  city={city}
                  edit={isEditing}
                  onCityRemove={handleCityRemove}
                  onCityUpdate={handleCityUpdate}
                />
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
};
