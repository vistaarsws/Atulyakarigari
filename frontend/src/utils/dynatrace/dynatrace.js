const DYNATRACE_RUM_SCRIPT = "https://<your-dynatrace-env>.live.dynatrace.com/js/api/load.js";

/**
 * Load Dynatrace Real User Monitoring (RUM) script in React
 */
export const loadDynatraceRUM = () => {
  const script = document.createElement("script");
  script.src = DYNATRACE_RUM_SCRIPT;
  script.async = true;
  script.onload = () => console.log("Dynatrace RUM loaded");
  document.body.appendChild(script);
};

export const trackUserEvent = (eventType, details) => {
    window.dtrum?.addAction(eventType, details);
  };
  