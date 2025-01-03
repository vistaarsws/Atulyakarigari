import "./CategotyView.css";
import rightArrow from "../../../../assets/images/rightArrow.svg";
import { ourCollections } from "../../../../utils/Constant";

import { getcategory } from "../../../../services/user/userAPI";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryView() {
  const [ourCollection, setOurCollection] = useState([]);

  const fetchCategoryData = async () => {
    const response = await getcategory();
    if (response?.data?.data) {
      // Convert the object into an array
      const categoryArray = Object.values(response.data.data);
      setOurCollection(categoryArray);
    }
    return response;
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);
  // console.log(ourCollection);

  return (
    <div className="collection_container">
      {ourCollections.map((collection, index) => {
        return (
          <div key={index}>
            <img src={collection.picture} alt={collection.collection_name} />

            <div
              className="collection_descriptionCard"
              style={{
                backgroundColor: collection.hoverBgColor,
              }}
            >
              {/* {console.log([index],ourCollection[index]?._id) 
              } */}
              <Link
                to={`/categories/${ourCollection[index]?._id}`}
                key={index}
              >
                <div key={index}>
                  <h3>{ourCollection[index]?.name}</h3>
                </div>
              </Link>

              <div></div>
              <p>{collection.collection_description}</p>
              <div>
                <img src={rightArrow} alt="Right Arrow" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
