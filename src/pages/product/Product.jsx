import { useParams } from "react-router-dom";
import ProductView from "../../components/layout/productView/productView";
import share from "../../assets/images/share.svg";
import star from "../../assets/images/reviewStar.svg";

import "./Product.css";
import WishListHeartIcon from "../../components/ui/micro_elements/wishListHeartIcon/wishListHeartIcon";
import { useState } from "react";

export default function Product() {
  let { userId } = useParams();

  const [productQuantity, setProductQuantity] = useState(0);

  const items = [{ label: "Banarsi Silk" }, { label: "Banarasi Nikhaar" }];
  const back = { icon: "pi pi-home", url: "https://primereact.org" };

  const product_description = {
    properties: [
      { type: "Occasion", value: "Festive/ Party/ Corporate" },
      { type: "Saree Length", value: "5.50 meter" },
      { type: "Fabric Care", value: "Dry clean only" },
      { type: "Colour", value: "Red (Sindoor)" },
      { type: "Fabric", value: "Pure Raw Silk" },
      { type: "Style", value: "Floral pattern with gota patti pallu" },
      { type: "Type", value: "Pure Silk" },
      { type: "Weight", value: "500 gm" },
      { type: "Blouse", value: "1 Meter unstitched blouse fabric" },
      { type: "Dimensions", value: "35.56 × 6.35 × 35.56 cm" },
    ],
  };

  return (
    <div className="product_container">
      <div>{/* <BreadCrumb model={items} home={back} /> */}</div>
      <div>
        <section>
          <ProductView />
        </section>
        <section className="product_details_header">
          <div>
            <h1>Banarsi Nikhaar</h1>
            <div>
              <WishListHeartIcon />
              <figure>
                <img src={share} alt="Share" />
              </figure>
            </div>
          </div>
          <p>
            Banarasi silk fabric is a fine quality silk variant originating from
            Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the
            rich history of India. Saree woven from silk is known as Banarasi
            silk Saree, which is an extremely famous fabric all over India and
            the world.
          </p>
          <div className="priceRatingContainer">
            <div>
              <div className="priceBox"> ₹ 26,700</div>
              <div className="ratingBox">
                <div>
                  4 <img src={star} alt="Star" />
                </div>
                <div>161 Rating</div>
              </div>
              <div className="pincodeBox">
                <div>
                  <input
                    type="number"
                    name="pincode"
                    id="pincode"
                    placeholder="Enter Pincode"
                  />
                </div>
                <div>
                  <button type="button">Check Pincode</button>
                </div>
              </div>
            </div>
          </div>
          <article className="product_details_description">
            <h2>Product Description</h2>
            <ul>
              {product_description.properties.map((property, index) => {
                return (
                  <li key={index}>
                    <div>{property.type}</div>
                    <div>{property.value}</div>
                    <div className="bottomLine"></div>
                  </li>
                );
              })}
            </ul>
          </article>
          <article className="product_details_userInputs">
            <div className="productQuantityCounter_container">
              <button onClick={() => setProductQuantity(productQuantity + 1)}>
                +
              </button>
              <div>{productQuantity}</div>
              <button
                onClick={() =>
                  productQuantity > 1 && setProductQuantity(productQuantity - 1)
                }
              >
                -
              </button>
            </div>
            <div>
              <button>Buy Now</button>
            </div>
            <div>
              <button>Add To Cart</button>
            </div>
          </article>
          <article className="tabView_container"></article>
        </section>
      </div>
    </div>
  );
}
