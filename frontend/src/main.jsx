import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ReactGA from "react-ga4";
import store from "./Redux/store/store.js";
import { Provider } from "react-redux";
import { initializeMetaPixel } from "./utils/pixel/metaPixel.js"; 

// Initialize Google Analytics
ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// Initialize Meta Pixel
initializeMetaPixel(import.meta.env.VITE_PIXEL_ID);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
