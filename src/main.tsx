import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import firebaseInit from './firebase';

import Header from './components/multiPageComponents/header';

//start firebase
firebaseInit();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Header/>

    <div style={{marginTop: '100px'}}>
      <AppRoutes />
    </div>
    </BrowserRouter>
  </StrictMode>,
);
