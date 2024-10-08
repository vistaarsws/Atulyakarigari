import { useParams } from "react-router-dom";
import ProductView from "../../components/layout/productView/productView";
import share from "../../assets/images/share.svg";
import star from "../../assets/images/reviewStar.svg";

import { BreadCrumb } from "primereact/breadcrumb";

import "./Product.css";
import WishListHeartIcon from "../../components/ui/micro_elements/wishListHeartIcon/wishListHeartIcon";

export default function Product() {
  let { userId } = useParams();
  const items = [{ label: "Banarsi Silk" }, { label: "Banarasi Nikhaar" }];
  const back = { icon: "pi pi-home", url: "https://primereact.org" };

  return (
    <div className="product_container">
      <div>
        <BreadCrumb model={items} home={back} />
      </div>
      <section>
        <div>
          <ProductView />
        </div>
        <article className="product_detials_section">
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
                  <input type="number" name="pincode" id="pincode" />
                </div>
                <div>
                  <button type="button">Check Pincode</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
