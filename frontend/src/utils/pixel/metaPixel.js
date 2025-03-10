export const initializeMetaPixel = (pixelId) => {
    if (!window.fbq) {
      window.fbq = function () {
        window.fbq.callMethod
          ? window.fbq.callMethod(...arguments)
          : window.fbq.queue.push(...arguments);
      };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = [];
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
  
      window.fbq("init", pixelId);
      // console.log("Meta Pixel initialized:", pixelId);
    }
  };
  
  export const trackEvent = (eventName, eventData = {}) => {
    if (window.fbq) {
      window.fbq("track", eventName, eventData);
      // console.log(`Meta Pixel Event: ${eventName}`, eventData);
    }
  };
  
  export const trackCustomEvent = (eventName, eventData = {}) => {
    if (window.fbq) {
      window.fbq("trackCustom", eventName, eventData);
      // console.log(`Meta Pixel Custom Event: ${eventName}`, eventData);
    }
  };
  