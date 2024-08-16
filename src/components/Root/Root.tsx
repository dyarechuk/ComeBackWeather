import { Route, Routes } from 'react-router-dom';
import App from '../../App';
import { CityDetails } from '../../pages';
import { AddCity } from '../AddCity';

export const Root: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route>
          <Route index element={<AddCity />} />
          <Route path="/:city" element={<CityDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};
