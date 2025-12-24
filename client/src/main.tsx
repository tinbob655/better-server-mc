import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/main.scss';

import Header from './components/multiPageComponents/header';
import Footer from './components/multiPageComponents/footer';
import AllRoutes from './routes';
import ServerStatusOverlay from './components/multiPageComponents/serverStatusOverlay/serverStatusOverlay';

import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <header>
        <Header/>
      </header>

      <div id="content">
        <ServerStatusOverlay/>
        <AllRoutes/>
      </div>

      <footer>
        <Footer/>
      </footer>
    </BrowserRouter>
  </StrictMode>,
)
