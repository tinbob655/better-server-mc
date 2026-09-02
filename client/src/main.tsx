import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client';
import "./scss/index.scss";
import {BrowserRouter} from "react-router";
import {AuthProvider} from "./context/auth/AuthProvider.tsx";
import {ServerStatusProvider} from "./context/serverStatus/ServerStatusProvider.tsx";
import ServerStatusOverlay from "./pages/serverStatus/serverStatusOverlay/ServerStatusOverlay.tsx";

import Header from "./components/header/Header.tsx";
import AllRoutes from "./AllRoutes.tsx";
import Footer from "./components/footer/Footer.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <ServerStatusProvider>
            <BrowserRouter>

                <Header/>
                <ServerStatusOverlay/>

                <div id={"content"}>
                    <Suspense>
                        <AllRoutes/>
                    </Suspense>
                </div>

                <Footer/>

            </BrowserRouter>
          </ServerStatusProvider>
      </AuthProvider>
  </StrictMode>,
)
