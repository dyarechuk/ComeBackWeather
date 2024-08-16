import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { HashRouter } from 'react-router-dom';
import { Root } from './components/Root/Root.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Root />
      </HashRouter>
    </Provider>
  </StrictMode>,
);
