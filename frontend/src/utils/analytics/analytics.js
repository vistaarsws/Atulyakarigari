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

export const trackPerformance = () => {
  if (window.performance) {
    // Track page load time (in ms)
    const performanceData = window.performance.timing;
    const pageLoadTime =
      performanceData.loadEventEnd - performanceData.navigationStart;
    logEvent("Performance", "Page Load Time", "Page Load", pageLoadTime);

    // Track First Contentful Paint (FCP) (in ms)
    if (window.performance.getEntriesByType("paint").length) {
      const fcpEntry = window.performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint");
      if (fcpEntry) {
        logEvent(
          "Performance",
          "First Contentful Paint",
          "FCP",
          fcpEntry.startTime
        );
      }
    }

    // Track Largest Contentful Paint (LCP) (in ms)
    if ("LargestContentfulPaint" in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "largest-contentful-paint") {
            logEvent(
              "Performance",
              "Largest Contentful Paint",
              "LCP",
              entry.startTime
            );
          }
        });
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    }
  }
};
