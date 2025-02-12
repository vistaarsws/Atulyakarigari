export const trackFrontendError = (error, info) => {
    window.dtrum?.addAction("JS Error", { message: error.message, componentStack: info.componentStack });
  };
  