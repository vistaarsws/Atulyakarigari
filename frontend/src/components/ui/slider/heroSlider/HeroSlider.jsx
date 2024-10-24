import PropTypes from "prop-types";
import "./HeroSlider.css";

export default function HeroSlider({ banner }) {
  return (
    <div>
      <section className="heroSlideContainer">
        <img src={banner} alt="" />
      </section>
    </div>
  );
}

HeroSlider.propTypes = {
  banner: PropTypes.string,
};
