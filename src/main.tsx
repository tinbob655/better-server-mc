import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import firebaseInit from './firebase';

//start firebase
firebaseInit();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
);
