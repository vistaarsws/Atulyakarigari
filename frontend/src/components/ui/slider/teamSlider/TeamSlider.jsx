import PropTypes from "prop-types";
import "./TeamSlider.css";

function TeamSlider({ picture, fullName, designation, description }) {
  return (
    <div className="teamSlider_card">
      <article>
        <img src={picture} alt="" />
        <div>
          <h1>{fullName}</h1>
          <h2>{designation}</h2>
        </div>
      </article>
      <article>
        <h1>{fullName}</h1>
        <em>{designation}</em>
        <div></div>
        <p>{description}</p>
      </article>
    </div>
  );
}

TeamSlider.propTypes = {
  picture: PropTypes.string,
  fullName: PropTypes.string,
  designation: PropTypes.string,
  description: PropTypes.string,
};

export default TeamSlider;
