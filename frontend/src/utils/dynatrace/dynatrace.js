
/**
 * Load Dynatrace Real User Monitoring (RUM) script in React
 */
export const loadDynatraceRUM = () => {
  const script = document.createElement("script");
  script.src = import.meta.VITE_DYNATRACE_RUM_SCRIPT;
  script.async = true;
  script.onload = () => console.log("Dynatrace RUM loaded");
  document.body.appendChild(script);
};

export const trackUserEvent = (eventType, details) => {
    window.dtrum?.addAction(eventType, details);
  };
  
  export const initializeDynatrace = () => {
    const script = document.createElement("script");
    script.src = import.meta.VITE_DYNATRACE_RUM_SCRIPT; 
    script.async = true;
  
    script.onload = () => {
      console.log("✅ Dynatrace RUM Script Loaded");
  
      // Wait until `window.dtrum` is ready
      const checkDynatraceReady = setInterval(() => {
        if (window.dtrum && typeof window.dtrum.sendCustomEvent === "function") {
          console.log("✅ Dynatrace RUM Initialized Successfully");
          clearInterval(checkDynatraceReady);
        }
      }, 500); // Check every 500ms
    };
  
    script.onerror = () => {
      console.error("❌ Failed to load Dynatrace RUM script");
    };
  
    document.head.appendChild(script);
  };
  