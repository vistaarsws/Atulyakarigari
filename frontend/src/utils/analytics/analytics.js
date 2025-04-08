import ReactGA from "react-ga4";

let eventGuard = {};

export const initializeAnalytics = () => {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID || 'default-id');
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};


export const logEvent = (category, action, label, value) => {
  const key = `${category}-${action}-${label}`;
  if (!eventGuard[key]) {
    ReactGA.event({ category, action, label, value });
    eventGuard[key] = true;

    // Clear guard after a short delay to allow subsequent events
    setTimeout(() => delete eventGuard[key], 1000);
  }
};
