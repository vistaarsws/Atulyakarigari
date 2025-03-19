import "./CategotyView.css";
import rightArrow from "../../../../assets/images/rightArrow.svg";
import { ourCollections } from "../../../../utils/Constant";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CategoryView() {
  const categoryArray = useSelector((state) => state.categories.categories);

  return (
    <div className="collection_container">
      {ourCollections?.map((collection, index) => {
        return (
          <div key={index}>
            <img src={collection.picture} alt={collection.collection_name} />

            <Link to={`/categories/${categoryArray[index]?._id}`} key={index}>
              <div
                className="collection_descriptionCard"
                style={{
                  backgroundColor: collection.hoverBgColor,
                }}
              >
                <h3>{categoryArray[index]?.name}</h3>

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
