import ReactGA from "react-ga4";

const setCustomDimension = (dimension, value) => {
  return ReactGA.set({ [dimension]: value });
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export { setCustomDimension, formatPrice };
