import { useState } from "react";
import PropTypes from "prop-types";
// import productpage_1 from "../../../../assets/images/cat5_2.png";
// import productpage_2 from "../../../../assets/images/productpage_2.png";
// import productpage_3 from "../../../../assets/images/productpage_3.png";
// import productpage_4 from "../../../../assets/images/productpage_4.png";

import "./ProductView.css";

const images = [];

export default function ProductView({ productImages = images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const changeSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className="slideshow" style={{ display: "flex" }}>
        {/* Thumbnail images in a vertical column */}
        <div className="thumbnails-container">
          {productImages.map((src, index) => (
            <img
              key={`thumbnail-${index}`}
              src={src}
              className={`slideshow-thumbnails ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => changeSlide(index)}
              alt={`Thumbnail ${index + 1}`}
            />
          ))}
        </div>

        {/* Main image */}
        <div id="slideshow-items-container" style={{ flexGrow: 1 }}>
          {productImages.map((src, index) => (
            <img
              key={`slideshow-item-${index}`}
              src={src}
              className={`slideshow-items ${
                index === activeIndex ? "active" : ""
              }`}
              alt={`Slide ${index + 1}`}
              style={{
                display: index === activeIndex ? "block" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

ProductView.propTypes = {
  productImages: PropTypes.array,
};
