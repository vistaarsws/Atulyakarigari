import "./CategotyView.css";
import rightArrow from "../../../assets/images/rightArrow.svg";
import { ourCollections } from "../../../utils/Constant";
import { Link } from "react-router-dom";

export default function CategoryView() {
  return (
    <div className="collection_container">
      {ourCollections.map((collection, index) => {
        return (
          <div key={index}>
            <img src={collection.picture} alt={collection.collection_name} />
            <Link to={"/categories"}>
              <div
                className="collection_descriptionCard"
                style={{
                  backgroundColor: collection.hoverBgColor,
                }}
              >
                <h3>{collection.collection_name}</h3>
                <div></div>
                <p>{collection.collection_description}</p>
                <div>
                  <img src={rightArrow} alt="Right Arrow" />
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
