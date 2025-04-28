import "./Home.css";
import { EmblaSlider } from "../../../components/ui/slider/EmblaSlider";
import { HeroBanner_array } from "../../../utils/Constant";
import artistry_1 from "../../../assets/images/ATK02.png";
import artistry_2 from "../../../assets/images/artistry_2.png";
import artistry_3 from "../../../assets/images/artistry_3.png";
import bg_pattern from "../../../assets/images/bgSidePattern.svg";
import ProductSection from "../../../components/layout/user/product-section/ProductSection";

import CategoryView from "../../../components/layout/user/category-view/CategoryView";
import { useMediaQuery } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { getCategory } from "../../../services/admin/adminAPI";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategory } from "../../../Redux/features/CategorySlice";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/ui/modal/confirmation-modal/card-skeleton/SkeletonLoader";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [getAllCategories, setGetAllCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading, hasFetched } = useSelector(
    (state) => state.categories
  );

  const fetchCategoriesData = async () => {
    try {
      const response = await getCategory();

      setGetAllCategories(Object.values(response?.data?.data));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchAllCategory()); // Fetch only if not already fetched
    }
  }, [dispatch, hasFetched]);

  const handleShopNow = () => {
    navigate(`/categories/6799c7d3464f0c78506ba778`); // Redirect to category page
  };
  const handleExploreNow = () => {
    navigate(`/categories/6799c7eb464f0c78506ba77c`); // Redirect to category
  };

  return (
    <>
      <section className="heroSection">
        <EmblaSlider
          slides={HeroBanner_array}
          options={{ delay: 3000, loop: true }}
          navigationDots={false}
          plugins={["autoplay"]}
        />
      </section>

      <div
        className="categoryView_container"
        style={{ marginInline: isMobile ? "0rem" : "0rem" }}
      >
        <CategoryView />
      </div>

      <section className="category-mapping">
        {loading && <p>Loading...</p>}
        {categories.length > 0 ? (
          categories.map((category, index) => {
            return (
              <Fragment key={index}>
                {index == 1 && (
                  <section className="celebrate_artistry_container">
                    <article>
                      <div className="card-item ">
                        <img src={artistry_1} alt="Artistry" />
                      </div>
                      <div className="card-item ">
                        <img src={artistry_2} alt="Artistry" />
                      </div>
                      <div className="card-item active">
                        <img src={artistry_3} alt="Artistry" />
                      </div>
                    </article>
                    <article>
                      <h2>Curated Elegance, Crafted with Tradition</h2>
                      <h1>
                        Celebrate Artistry:
                        <em>Handicrafts, Handlooms, and Jewellery</em>
                      </h1>
                      <article id="mobileView_loopAnimation">
                        <div className="card-item ">
                          <img src={artistry_1} alt="Artistry" />
                        </div>
                        <div className="card-item ">
                          <img src={artistry_2} alt="Artistry" />
                        </div>
                        <div className="card-item active">
                          <img src={artistry_3} alt="Artistry" />
                        </div>
                      </article>
                      <p>
                        Discover a world where timeless handicrafts, exquisite
                        handloom fabrics, and artisanal jewelry come together.
                        Each piece is a testament to tradition and skilled
                        craftsmanship, designed to bring beauty and meaning to
                        your everyday life. Explore our curated collections and
                        embrace the elegance of true artistry.
                      </p>
                      <button onClick={handleExploreNow}>Explore Now</button>
                    </article>
                  </section>
                )}

                <div key={category._id} className="category-container">
                  <div className="subcategories">
                    {category.subcategory?.length > 0 ? (
                      category.subcategory.map((subcat) => (
                        <div key={subcat._id} className="subcategory-container">
                          <ProductSection
                            productCategorySection={{
                              title: subcat.name,
                              subtitle: `Explore products in ${subcat.name}`,
                              products: subcat.products,
                              subcategory_id: subcat._id,
                              // Now includes detailed product info.
                            }}
                            bgColor="#fff"
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <SkeletonLoader />
                      </>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        )}
      </section>

      <section className="noDiscount_container">
        <img src={bg_pattern} alt="Background Pattern" />

        <figure>
          <div>
            <h2>Your Purchase is Empowering Artisans Directly</h2>
            <hr />
            <p>
              When you shop with us, you support artisans and preserve
              traditional craftsmanship. Each purchase sustains their
              livelihoods and artistry.
            </p>
          </div>
        </figure>
        <article>
          <hr />
          <h1>
            Why We <em>Don&apos;t</em> Offer Discounts
          </h1>
          <div className="noDiscountCard_container">
            <div>
              <figure>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5171 3.12966C14.8297 2.78053 15.2124 2.50125 15.6402 2.31005C16.068 2.11885 16.5314 2.02002 17 2.02002C17.4686 2.02002 17.932 2.11885 18.3598 2.31005C18.7876 2.50125 19.1703 2.78053 19.4829 3.12966L20.6494 4.43283C20.9828 4.80528 21.3957 5.09796 21.8575 5.28921C22.3193 5.48046 22.8182 5.56539 23.3173 5.53769L25.067 5.44103C25.535 5.41523 26.0032 5.48844 26.441 5.65588C26.8788 5.82331 27.2763 6.08121 27.6077 6.41273C27.939 6.74424 28.1968 7.14193 28.364 7.57981C28.5312 8.01769 28.6042 8.48591 28.5782 8.95392L28.4815 10.702C28.4541 11.2009 28.5391 11.6995 28.7303 12.161C28.9216 12.6225 29.2141 13.0351 29.5863 13.3684L30.8895 14.5349C31.2388 14.8475 31.5184 15.2303 31.7097 15.6583C31.9011 16.0863 32 16.5499 32 17.0187C32 17.4876 31.9011 17.9511 31.7097 18.3791C31.5184 18.8071 31.2388 19.19 30.8895 19.5026L29.5863 20.6691C29.2139 21.0025 28.9212 21.4154 28.73 21.8772C28.5387 22.339 28.4538 22.838 28.4815 23.3371L28.5782 25.0869C28.604 25.5549 28.5308 26.0231 28.3633 26.4609C28.1959 26.8987 27.938 27.2962 27.6065 27.6276C27.275 27.9589 26.8773 28.2167 26.4395 28.3839C26.0016 28.5511 25.5334 28.6241 25.0654 28.5981L23.3173 28.5014C22.8185 28.474 22.3199 28.559 21.8584 28.7503C21.3969 28.9415 20.9843 29.2341 20.6511 29.6063L19.4846 30.9094C19.172 31.2588 18.7892 31.5384 18.3612 31.7297C17.9332 31.9211 17.4697 32.02 17.0008 32.02C16.532 32.02 16.0685 31.9211 15.6405 31.7297C15.2125 31.5384 14.8297 31.2588 14.5171 30.9094L13.3506 29.6063C13.0172 29.2338 12.6043 28.9411 12.1425 28.7499C11.6807 28.5586 11.1818 28.4737 10.6827 28.5014L8.93295 28.5981C8.46495 28.6239 7.99677 28.5507 7.55898 28.3832C7.12119 28.2158 6.72365 27.9579 6.3923 27.6264C6.06095 27.2949 5.80325 26.8972 5.63602 26.4593C5.4688 26.0214 5.39582 25.5532 5.42184 25.0852L5.51849 23.3371C5.54593 22.8383 5.46089 22.3396 5.26965 21.8781C5.07841 21.4166 4.78587 21.004 4.41367 20.6708L3.11054 19.5042C2.76115 19.1916 2.48164 18.8088 2.29028 18.3808C2.09891 17.9528 2 17.4892 2 17.0204C2 16.5515 2.09891 16.088 2.29028 15.66C2.48164 15.232 2.76115 14.8492 3.11054 14.5365L4.41367 13.37C4.7861 13.0366 5.07878 12.6237 5.27002 12.1619C5.46127 11.7001 5.54619 11.2011 5.51849 10.702L5.42184 8.95225C5.39628 8.48437 5.46967 8.01636 5.63721 7.57876C5.80475 7.14116 6.06267 6.74381 6.39415 6.41263C6.72563 6.08146 7.12322 5.8239 7.56096 5.65677C7.99871 5.48964 8.46677 5.4167 8.93461 5.4427L10.6827 5.53935C11.1815 5.5668 11.6801 5.48175 12.1416 5.29051C12.6031 5.09927 13.0157 4.80672 13.3489 4.4345L14.5171 3.12966Z"
                    stroke="#6F6F6F"
                    strokeOpacity="0.2"
                    strokeWidth="3"
                  />
                  <path
                    d="M12.8341 12.854H12.8508V12.8707H12.8341V12.854ZM21.1661 21.1863H21.1828V21.2029H21.1661V21.1863Z"
                    stroke="#6F6F6F"
                    strokeOpacity="0.2"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.9994 12.02L12.001 22.0187"
                    stroke="#6F6F6F"
                    strokeOpacity="0.2"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </figure>
              <p>
                We don&apos;t offer discounts because we stand by the
                craftsmanship and excellence that goes into every item we
                create.
              </p>
            </div>
            <div>
              <figure>
                <svg
                  width="35"
                  height="31"
                  viewBox="0 0 35 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.3125 0.0200195C22.0859 0.0200195 19.2609 1.40785 17.5 3.75371C15.7391 1.40785 12.9141 0.0200195 9.6875 0.0200195C7.1191 0.0229151 4.65673 1.04473 2.8406 2.86129C1.02447 4.67785 0.0028949 7.1408 0 9.7098C0 20.6499 16.2172 29.5051 16.9078 29.8708C17.0898 29.9688 17.2933 30.02 17.5 30.02C17.7067 30.02 17.9102 29.9688 18.0922 29.8708C18.7828 29.5051 35 20.6499 35 9.7098C34.9971 7.1408 33.9755 4.67785 32.1594 2.86129C30.3433 1.04473 27.8809 0.0229151 25.3125 0.0200195ZM17.5 27.339C14.6469 25.6761 2.5 18.1008 2.5 9.7098C2.50248 7.80387 3.26053 5.97671 4.60791 4.62902C5.95529 3.28132 7.78202 2.52309 9.6875 2.52061C12.7266 2.52061 15.2781 4.13974 16.3438 6.74035C16.4379 6.96967 16.5981 7.16581 16.804 7.30384C17.0099 7.44188 17.2521 7.51558 17.5 7.51558C17.7479 7.51558 17.9901 7.44188 18.196 7.30384C18.4019 7.16581 18.5621 6.96967 18.6562 6.74035C19.7219 4.13505 22.2734 2.52061 25.3125 2.52061C27.218 2.52309 29.0447 3.28132 30.3921 4.62902C31.7395 5.97671 32.4975 7.80387 32.5 9.7098C32.5 18.0883 20.35 25.6745 17.5 27.339Z"
                    fill="#6F6F6F"
                    fillOpacity="0.2"
                  />
                </svg>
              </figure>
              <p>
                Get quality not discounts! Seek excellence, reliability, and
                long-term satisfaction. It&apos;s time to consider the value and
                quality elegance.
              </p>
            </div>
            <div>
              <figure>
                {/* <svg
                  width="30"
                  height="31"
                  viewBox="0 0 30 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.125 13.6533C15.375 13.4658 14.625 13.0908 14.0625 12.5283C13.5 12.3408 13.3125 11.7783 13.3125 11.4033C13.3125 11.0283 13.5 10.4658 13.875 10.2783C14.4375 9.90332 15 9.52832 15.5625 9.71582C16.6875 9.71582 17.625 10.2783 18.1875 11.0283L19.875 8.77832C19.3125 8.21582 18.75 7.84082 18.1875 7.46582C17.625 7.09082 16.875 6.90332 16.125 6.90332V4.27832H13.875V6.90332C12.9375 7.09082 12 7.65332 11.25 8.40332C10.5 9.34082 9.9375 10.4658 10.125 11.5908C10.125 12.7158 10.5 13.8408 11.25 14.5908C12.1875 15.5283 13.5 16.0908 14.625 16.6533C15.1875 16.8408 15.9375 17.2158 16.5 17.5908C16.875 17.9658 17.0625 18.5283 17.0625 19.0908C17.0625 19.6533 16.875 20.2158 16.5 20.7783C15.9375 21.3408 15.1875 21.5283 14.625 21.5283C13.875 21.5283 12.9375 21.3408 12.375 20.7783C11.8125 20.4033 11.25 19.8408 10.875 19.2783L9 21.3408C9.5625 22.0908 10.125 22.6533 10.875 23.2158C11.8125 23.7783 12.9375 24.3408 14.0625 24.3408V26.7783H16.125V23.9658C17.25 23.7783 18.1875 23.2158 18.9375 22.4658C19.875 21.5283 20.4375 20.0283 20.4375 18.7158C20.4375 17.5908 20.0625 16.2783 19.125 15.5283C18.1875 14.5908 17.25 14.0283 16.125 13.6533ZM15 0.52832C6.75 0.52832 0 7.27832 0 15.5283C0 23.7783 6.75 30.5283 15 30.5283C23.25 30.5283 30 23.7783 30 15.5283C30 7.27832 23.25 0.52832 15 0.52832ZM15 28.4658C7.875 28.4658 2.0625 22.6533 2.0625 15.5283C2.0625 8.40332 7.875 2.59082 15 2.59082C22.125 2.59082 27.9375 8.40332 27.9375 15.5283C27.9375 22.6533 22.125 28.4658 15 28.4658Z"
                    fill="#6F6F6F"
                    fillOpacity="0.2"
                  />
                </svg> */}

                <svg
                  width="34"
                  height="34"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="6F6F6F"
                  fillOpacity="0.2"
                >
                  <path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM13.5003 8C13.8278 8.43606 14.0625 8.94584 14.175 9.5H16V11H14.175C13.8275 12.7117 12.3142 14 10.5 14H10.3107L14.0303 17.7197L12.9697 18.7803L8 13.8107V12.5H10.5C11.4797 12.5 12.3131 11.8739 12.622 11H8V9.5H12.622C12.3131 8.62611 11.4797 8 10.5 8H8V6.5H16V8H13.5003Z"></path>
                </svg>
              </figure>
              <p>
                Our dedication to maintaining fair pricing ensures that you
                receive the true worth of our meticulously crafted goods.
              </p>
            </div>
            <div>
              <em>
                Get quality not discounts! Seek excellence, reliability, and
                long-term satisfaction. It&apos;s time to consider the value and
                quality elegance.
              </em>
              <button onClick={handleShopNow}>Shop Now</button>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
