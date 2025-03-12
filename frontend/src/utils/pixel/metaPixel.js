export const initializeMetaPixel = (pixelId) => {
  if (!pixelId) {
    console.warn("Meta Pixel ID is missing.");
    return;
  }

  // Prevent multiple initializations
  if (window.fbq && window.fbq.loaded) {
    console.warn("Meta Pixel is already initialized.");
    return;
  }

  window.fbq = function () {
    window.fbq.callMethod
      ? window.fbq.callMethod(...arguments)
      : window.fbq.queue.push(...arguments);
  };

  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  // ✅ Prevent adding the script multiple times
  if (!document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    
    // ✅ Add event listeners for better debugging
    script.onload = () => console.log("✅ Meta Pixel loaded successfully.");
    script.onerror = () => console.warn("❌ Meta Pixel failed to load (possibly blocked by an ad blocker).");

    document.head.appendChild(script);
  }

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

// ✅ Queue events if fbq isn’t ready yet
const queueEvent = (method, eventName, eventData) => {
  if (window.fbq && window.fbq.loaded) {
    window.fbq(method, eventName, eventData);
  } else {
    window.fbq.queue.push([method, eventName, eventData]);
  }
};

export const trackEvent = (eventName, eventData = {}) => {
  queueEvent("track", eventName, eventData);
};

export const trackCustomEvent = (eventName, eventData = {}) => {
  queueEvent("trackCustom", eventName, eventData);
};
