import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import "./scss/index.scss";
import {BrowserRouter} from "react-router";

import Header from "./components/header/Header.tsx";
import AllRoutes from "./AllRoutes.tsx";
import Footer from "./components/footer/Footer.tsx";
import {AuthProvider} from "./context/auth/AuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <BrowserRouter>

          <Header/>

          <div id={"content"}>
            <AllRoutes/>
          </div>

          <Footer/>

        </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
)
