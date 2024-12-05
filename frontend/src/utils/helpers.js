import ReactGA from "react-ga4";

const setCustomDimension = (dimension, value) => {
  return ReactGA.set({ [dimension]: value });
};

export default setCustomDimension;
