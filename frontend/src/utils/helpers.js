import ReactGA from "react-ga4";

const setCustomDimension = (dimension, value) => {
  return ReactGA.set({ [dimension]: value });
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export { setCustomDimension, formatPrice };
