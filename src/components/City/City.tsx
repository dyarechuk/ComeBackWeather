import React, { useState } from 'react';
import { CityDetail } from '../../types/CityDetail';
import { Link } from 'react-router-dom';
import { RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  city: CityDetail;
  edit: boolean;
  onCityRemove: (city: string) => void;
  onCityUpdate: (city: string) => void;
}

export const City: React.FC<Props> = ({
  city,
  edit,
  onCityRemove,
  onCityUpdate,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleDeleteButtonClicked = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onCityRemove(city.name);
  };

  const handleRefreshButtonClicked = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsRotating(true);

    onCityUpdate(city.name);

    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  const handleLinkClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (event.target instanceof HTMLElement && event.target.closest('button')) {
      event.preventDefault();
    }
  };

  return (
    <Link
      to={city.name}
      className="relative flex flex-col p-5 min-h-[350px] text-white shadow-sm"
      onClick={handleLinkClick}
    >
      {edit && (
        <button
          onClick={handleDeleteButtonClicked}
          className="absolute bottom-0 left-0 z-40 bg-[#333333] text-xl border border-[#333333] rounded-tr-2xl rounded-bl-2xl p-3"
        >
          <Trash2 size={30} color="red" />
        </button>
      )}
      {!edit && (
        <button
          onClick={handleRefreshButtonClicked}
          className={`absolute bottom-0 left-0 z-40 bg-[#333333] text-xl border border-[#333333] rounded-tr-2xl rounded-bl-2xl p-3`}
        >
          <RefreshCw
            size={30}
            color="white"
            className={`tranition-all duration-500 ${
              isRotating && 'rotate-[360deg]' 
            }`}
          />
        </button>
      )}
      <span className="z-10 block capitalize text-xl font-semibold">
        {city.name}
      </span>
      <div className="flex justify-end items-end flex-1 z-10">
        <span className="text-3xl mr-2">
          {Math.round(city.currentWeather.main.temp)}&deg;
        </span>
        <img
          src={`./conditions/${city.currentWeather.weather[0].icon}.svg`}
          alt={city.currentWeather.weather[0].description}
          className="h-5"
        />
      </div>
      <div className="absolute rounded-2xl top-0 left-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          src={`./videos/${city.currentWeather.weather[0].icon}.mp4`}
          className="w-full h-full object-cover"
        ></video>
        <div className="absolute top-0 w-full h-full bg-black opacity-20"></div>
      </div>
    </Link>
  );
};
