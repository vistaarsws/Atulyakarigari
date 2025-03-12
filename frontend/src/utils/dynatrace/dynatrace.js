export const loadDynatraceRUM = () => {
  if (document.getElementById("dynatrace-rum-script")) {
    console.warn("Dynatrace RUM script already loaded");
    return;
  }

  const scriptUrl = import.meta.env.VITE_DYNATRACE_RUM_SCRIPT;
  if (!scriptUrl) {
    console.error("❌ Dynatrace RUM script URL is not defined");
    return;
  }

  const script = document.createElement("script");
  script.id = "dynatrace-rum-script";
  script.src = scriptUrl;
  script.async = true;

  script.onload = () => console.log("✅ Dynatrace RUM loaded successfully");
  script.onerror = () =>
    console.error("❌ Failed to load Dynatrace RUM script");

  document.head.appendChild(script);
};

export const trackUserEvent = (eventType, details) => {
  if (window.dtrum && typeof window.dtrum.addAction === "function") {
    window.dtrum.addAction(eventType, details);
  } else {
    console.warn("⚠️ Dynatrace RUM is not initialized yet");
  }
};

export const initializeDynatrace = () => {
  if (document.getElementById("dynatrace-rum-script")) {
    console.warn("Dynatrace RUM script already loaded");
    return;
  }

  const scriptUrl = import.meta.env.VITE_DYNATRACE_RUM_SCRIPT;
  if (!scriptUrl) {
    console.error("❌ Dynatrace RUM script URL is not defined");
    return;
  }

  const script = document.createElement("script");
  script.id = "dynatrace-rum-script";
  script.src = scriptUrl;
  script.async = true;

  script.onload = () => {
    console.log("✅ Dynatrace RUM Script Loaded");

    // Wait until `window.dtrum` is available
    const checkDynatraceReady = setInterval(() => {
      if (window.dtrum && typeof window.dtrum.sendCustomEvent === "function") {
        console.log("✅ Dynatrace RUM Initialized Successfully");
        clearInterval(checkDynatraceReady);
      }
    }, 500);
  };

  script.onerror = () => {
    console.error("❌ Failed to load Dynatrace RUM script");
  };

  document.head.appendChild(script);
};
