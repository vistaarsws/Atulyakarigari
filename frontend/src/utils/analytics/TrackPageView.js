import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logPageView } from "./analytics";

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, []);

  return null;
};

export default TrackPageView;
