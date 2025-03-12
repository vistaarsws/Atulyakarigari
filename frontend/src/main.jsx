import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ReactGA from "react-ga4";
import store from "./Redux/store/store.js";
import { Provider } from "react-redux";
import { initializeMetaPixel } from "./utils/pixel/metaPixel.js"; 
import { initializeDynatrace } from "./utils/dynatrace/dynatrace.js";

// Ensure scripts run only in the browser (avoid SSR issues)
if (typeof window !== "undefined") {
  // Initialize Dynatrace only once
  initializeDynatrace();

  // Initialize Google Analytics safely
  const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (GA_ID) {
    ReactGA.initialize(GA_ID);
  } else {
    console.warn("⚠️ Google Analytics Measurement ID is missing");
  }

  // Initialize Meta Pixel safely
  const PIXEL_ID = import.meta.env.VITE_PIXEL_ID;
  if (PIXEL_ID) {
    initializeMetaPixel(PIXEL_ID);
  } else {
    console.warn("⚠️ Meta Pixel ID is missing");
  }
}

// Render React app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
