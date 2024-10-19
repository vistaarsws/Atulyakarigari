import PropTypes from "prop-types";
import "./ArtisansSlide.css";
import leftQuote from "../../../../assets/images/quote-left-svgrepo-com.svg";

function ArtisansSlide({ fullName, designation, story, picture }) {
  return (
    <div className="artisansSlider_container">
      <section>
        <article>
          <h1>{fullName}</h1>
          <h2>{designation}</h2>
        </article>
        <figure>
          <img src={picture} alt="Artisan Picture" />
        </figure>
        <article>
          <span>
            <img src={leftQuote} alt="Quotation Mark" />
          </span>
          <h3>Story</h3>
          <p>{story}</p>
        </article>
      </section>
    </div>
  );
}

ArtisansSlide.propTypes = {
  fullName: PropTypes.string,
  designation: PropTypes.string,
  story: PropTypes.string,
  picture: PropTypes.string,
};

export default ArtisansSlide;
