import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import "./scss/index.scss";
import {BrowserRouter} from "react-router";

import Header from "./components/header/Header.tsx";
import AllRoutes from "./AllRoutes.tsx";
import Footer from "./components/footer/Footer.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Header/>

      <div id={"content"}>
        <AllRoutes/>
      </div>

      <Footer/>
    </BrowserRouter>
  </StrictMode>,
)
