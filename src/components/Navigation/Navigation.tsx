import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as weatherActions } from '../../features/weatherSlice';
import { actions as cityModalActions } from '../../features/addCityModalSlice';
import { CloudDrizzle, House, Pencil, Plus, RefreshCw } from 'lucide-react';

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isEditing } = useAppSelector((state) => state.weather);

  const reloadApp = () => {
    window.location.reload();
  };

  const onEditCities = () => {
    dispatch(weatherActions.changeIsEditing(!isEditing));
  };

  const onAddCity = () => {
    dispatch(cityModalActions.changeModalState(true));
  };

  const currentDate = new Date();
  const weekday = currentDate.toLocaleString('en-us', { weekday: 'short' });
  const month = currentDate.toLocaleString('en-us', { month: 'short' });
  const day = currentDate.toLocaleString('en-us', { day: '2-digit' });
  const location = useLocation();

  return (
    <div>
      {location.pathname === '/' ? (
        <header className="z-50 bg-[#3b4460] fixed max-w-[1280px] w-full px-5 shadow-md top-0 rounded-b-2xl animate-gradient-animation">
          <nav className="flex py-[30px] text-white justify-between items-center">
            <div className="flex gap-3">
              <span className="font-semibold">ComeBackWeather</span>
              <CloudDrizzle />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onEditCities}
                className="bg-[#3b4460] p-2 cursor-pointer rounded-xl group border border-slate-500 hover:border-slate-100 hover:bg-[#576db5] transition-all duration-600"
              >
                <Pencil size={20} color="#FFF" />
              </button>
              <button
                onClick={reloadApp}
                className="bg-[#3b4460] p-2 cursor-pointer rounded-xl group border border-slate-500 hover:border-slate-100 hover:bg-[#576db5] transition-all duration-600"
              >
                <RefreshCw size={20} color="#FFF" />
              </button>
              <button
                onClick={onAddCity}
                className="bg-[#3b4460] p-2 cursor-pointer rounded-xl group border border-slate-500 hover:border-slate-100 hover:bg-[#576db5] transition-all duration-600"
              >
                <Plus size={20} color="#FFF" />
              </button>
            </div>
          </nav>
        </header>
      ) : (
        <header className="bg-gradient-to-r from-[#3b4460] to-[#556a77] w-full rounded-b-2xl animate-gradient-animation h-[98px] relative text-white">
          <nav className="absolute w-full flex justify-between px-5 top-1/2 -translate-y-1/2">
            <Link className="hover:scale-105 transition-all" to="/">
              <House />
            </Link>
            <span>{`${weekday}, ${month} ${day}`}</span>
            <span>&deg; C</span>
          </nav>
        </header>
      )}
    </div>
  );
};
