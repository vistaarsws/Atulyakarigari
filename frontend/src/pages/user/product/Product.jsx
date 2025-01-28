import { useNavigate, useParams } from "react-router-dom";
import ProductView from "../../../components/layout/user/product-view/ProductView";
import share from "../../../assets/images/share.svg";
import star from "../../../assets/images/reviewStar.svg";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import about_artisan from "../../../assets/images/about_artisan.png";
import review_person from "../../../assets/images/reviewPerson.png";
import {
  Avatar,
  Box,
  Typography,
  Rating,
  Stack,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { logEvent } from "../../../utils/analytics/analytics";

import "./Product.css";
import WishListHeartIcon from "../../../components/ui/micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useState } from "react";
import ProductSection from "../../../components/layout/user/product-section/ProductSection";
import cat5_1 from "../../../assets/images/cat5_1.png";
import cat5_2 from "../../../assets/images/cat5_2.png";
import cat5_3 from "../../../assets/images/cat5_3.png";
import cat5_4 from "../../../assets/images/cat5_4.png";
import cat5_5 from "../../../assets/images/cat5_5.png";
import { getProductById } from "../../../../src/services/user/userAPI";

// ----------------------------------------------------------------------------------------
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
// ----------------------------------------------------------------------------------------
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const theme = createTheme({
  palette: {
    secondary: {
      main: "#6d001d", // Set red as the secondary color
    },
  },
});

export default function Product() {
  let { id: productId } = useParams();
  const [productQuantity, setProductQuantity] = useState(0);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const breadcrumbItems = [
    // { title: "Home", href: "/" },
    { title: "Banarsi Silk ", href: "/categories" },
    { title: "Banarasi Nikhaar", href: "/categories" },
  ];

  const items = breadcrumbItems.map((item, index) => ({
    title:
      index === breadcrumbItems.length - 1 ? (
        <span style={{ color: "#1890ff" }}>{item.title}</span> // Highlight the last item
      ) : (
        item.title
      ),
    href: item.href,
  }));

  // const product_description = {
  //   properties: [
  //     { type: "Occasion", value: "Festive/ Party/ Corporate" },
  //     { type: "Saree Length", value: "5.50 meter" },
  //     { type: "Fabric Care", value: "Dry clean only" },
  //     { type: "Colour", value: "Red (Sindoor)" },
  //     { type: "Fabric", value: "Pure Raw Silk" },
  //     { type: "Style", value: "Floral pattern with gota patti pallu" },
  //     { type: "Type", value: "Pure Silk" },
  //     { type: "Weight", value: "500 gm" },
  //     // { type: "Blouse", value: "1 Meter unstitched blouse fabric" },
  //     // { type: "Dimensions", value: "35.56 × 6.35 × 35.56 cm" },
  //   ],
  // };
  // const similar_product = {
  //   title: "Similar Products",
  //   subtitle: "Bringing tradition to life: Explore handcrafted wonders.",
  //   products: [
  //     {
  //       key: "1",
  //       title: "Kashi Kalaa",
  //       picture: cat5_1,
  //       price: 2000.0,
  //     },
  //     {
  //       key: "2",
  //       title: "Kashi Kalaa",
  //       picture: cat5_2,
  //       price: 4000.0,
  //     },
  //     {
  //       key: "3",
  //       title: "Silken Splendor",
  //       picture: cat5_3,
  //       price: 2000.0,
  //     },
  //     {
  //       key: "4",
  //       title: "Silken Splendor",
  //       picture: cat5_4,
  //       price: 6000.0,
  //     },
  //     {
  //       key: "5",
  //       title: "Silken Splendor",
  //       picture: cat5_5,
  //       price: 3000.0,
  //     },
  //     {
  //       key: "6",
  //       title: "Silken Splendor",
  //       picture: cat5_1,
  //       price: 12000,
  //     },
  //     {
  //       key: "7",
  //       title: "Silken Splendor",
  //       picture: cat5_2,
  //       price: 12000,
  //     },
  //   ],
  // };
  // const you_may_also_like = {
  //   title: "You May Also Like",
  //   subtitle: "Bringing tradition to life: Explore handcrafted wonders.",
  //   products: [
  //     {
  //       key: "1",
  //       title: "Kashi Kalaa",
  //       picture: cat5_1,
  //       price: 2000.0,
  //     },
  //     {
  //       key: "2",
  //       title: "Kashi Kalaa",
  //       picture: cat5_2,
  //       price: 4000.0,
  //     },
  //     {
  //       key: "3",
  //       title: "Silken Splendor",
  //       picture: cat5_3,
  //       price: 2000.0,
  //     },
  //     {
  //       key: "4",
  //       title: "Silken Splendor",
  //       picture: cat5_4,
  //       price: 6000.0,
  //     },
  //     {
  //       key: "5",
  //       title: "Silken Splendor",
  //       picture: cat5_5,
  //       price: 3000.0,
  //     },
  //     {
  //       key: "6",
  //       title: "Silken Splendor",
  //       picture: cat5_1,
  //       price: 12000,
  //     },
  //     {
  //       key: "7",
  //       title: "Silken Splendor",
  //       picture: cat5_2,
  //       price: 12000,
  //     },
  //   ],
  // };

  const startTime = useRef(null); // Track when the user enters the page
  const [product, setProduct] = useState(null);
  const fetchProduct = async () => {
    const response = await getProductById(productId);
    setProduct(response?.data?.data);
    console.log("response", response?.data?.data);
  };

  useEffect(() => {
    // Record the time the user enters the page
    startTime.current = new Date();
    fetchProduct();
    return () => {
      // Calculate time spent when the user leaves the page
      const endTime = new Date();
      const timeSpent = Math.floor((endTime - startTime.current) / 1000); // Time in seconds

      // Log to analytics
      logEvent("Product", "Time Spent", productId, timeSpent);
      console.log(`User spent ${timeSpent} seconds on product ${productId}`);
    };
  }, [productId]); // Track changes to the product ID in case the route changes

  return (
    <ThemeProvider theme={theme}>
      <div className="product_container">
        <div>
          <Breadcrumb
            items={[
              {
                title: product?.category?.name || "category",
                href: `/categories/${product?.category?._id}`,
              },
              { title: product?.subcategory?.name || "subcategory", href: "" },
            ]}
          />
        </div>
        <div>
          <section>
            <ProductView productImages={product?.images} />
            {/* {console.log(<ProductView images={product?.images} />)} */}
          </section>
          <section className="product_details_header">
            <div>
              <h1>{product?.name}</h1>
              <div>
                <WishListHeartIcon productId={product?._id} />
                <figure>
                  <img src={share} alt="Share" />
                </figure>
              </div>
            </div>
            <p>{product?.description || "No Description"}</p>
            <div className="priceRatingContainer">
              <div>
                <div className="priceBox">
                  <h2>
                    ₹
                    {(
                      product?.price -
                      (product?.price * product?.discountPercentage) / 100
                    ).toFixed() || "N/A"}
                  </h2>
                  <strike>₹{product?.price || "N/A"}</strike>
                  <h4>(-{product?.discountPercentage || 0}%)</h4>
                </div>

                <div className="ratingBox">
                  <div>
                    <span>4</span> <img src={star} alt="Star" />
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
                    <button type="button">Check</button>
                  </div>
                </div>
              </div>
            </div>
            <article className="product_details_description">
              <h2>Product Description</h2>
              <ul>
                {product?.attributes.map((property, index) => {
                  console.log("property", property);
                  return (
                    <li key={index}>
                      <div>{property.key}</div>
                      {property?.value?.map((val, i) => (
                        <span key={i}>{val}</span>
                      ))}
                      <div className="bottomLine"></div>
                    </li>
                  );
                })}
              </ul>
            </article>
            <article className="product_details_userInputs">
              <div className="productQuantityCounter_container">
                <button
                  onClick={() =>
                    productQuantity > 1 &&
                    setProductQuantity(productQuantity - 1)
                  }
                >
                  -
                </button>
                <div>{productQuantity}</div>
                <button onClick={() => setProductQuantity(productQuantity + 1)}>
                  +
                </button>
              </div>
              <div>
                <button onClick={() => navigate("/buy-now")}>Buy Now</button>
              </div>
              <div>
                <button onClick={() => navigate("/buy-now")}>
                  Add To Cart
                </button>
              </div>
            </article>
            <article className="tabView_container">
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  overflow: "scroll",
                  scrollbarWidth: "none",
                  width: useMediaQuery("(max-width:600px)") ? "87vw" : "100%",
                }}
              >
                <Tabs
                  value={value}
                  variant="scrollable"
                  scrollButtons="false"
                  onChange={handleChange}
                  className="Product_tab_items"
                  textColor="secondary"
                  indicatorColor="secondary"
                  // sx={{
                  //   // "& .MuiTab-root": { color: "red" }, // Unselected tab text color
                  //   "& .Mui-selected": { color: "#6d001d" }, // Selected tab text color
                  //   "& .MuiTabs-indicator": { backgroundColor: "#6d001d" }, // Indicator color
                  // }}
                >
                  <Tab label="About Artisan" {...a11yProps(0)} />
                  <Tab label="Detail Description" {...a11yProps(1)} />
                  <Tab label="Reviews" {...a11yProps(2)} />
                  <Tab label="Questions" {...a11yProps(3)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div className="about_artisan">
                  <figure>
                    <img src={product?.artisanImage} alt="About Artisan" />
                  </figure>
                  <div>
                    <h3>{product?.artisanName}</h3>
                    <p>{product?.artisanAbout}</p>
                  </div>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="detail_description">
                  <ul>
                    <li>
                      <h3>Wash Care</h3>
                      <p>
                        Cotton Fabric -First wash dry clean and after that
                        gentle machine wash. Silk Fabric- Dry clean only. Home
                        decor -clean with a dry/damp cloth. For any other
                        product - Please find the wash care in the product
                        description.
                      </p>
                    </li>
                    <li>
                      <h3>7 Days free return</h3>
                      <p>
                        Product(s) can be exchanged within 7 days from the date
                        of purchase. On SALE and CUSTOMISED product - No Return
                        /Refund
                      </p>
                    </li>
                    <li>
                      <h3>Shipping</h3>
                      <p>
                        Free shipping within India. Shipping out of India is as
                        per weight calculation at checkout. Packing: Atulya
                        Karigari ensures to provide the finest packing with
                        proper safety of the products intact.
                      </p>
                    </li>
                  </ul>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <div className="reviews_section">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      borderBottom: "1px solid #e0e0e0",

                      width: "100%",
                    }}
                  >
                    <Avatar
                      alt="Priya Sharma"
                      src={review_person}
                      sx={{ width: 56, height: 56, marginBottom: "auto" }}
                    />

                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Stack
                        display="grid"
                        marginTop="1rem"
                        gridTemplateColumns="1fr 1fr "
                        direction="row"
                        alignItems="center"
                        justifyContent="start"
                        spacing={1}
                      >
                        <Rating name="read-only" value={5} readOnly />
                        <div></div>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "1.2rem",
                            marginLeft: "0rem !important",
                          }}
                        >
                          - Priya Sharma
                        </Typography>

                        <Typography
                          sx={{
                            margin: "0 !important",
                            textAlign: "right",
                            fontSize: "1.2rem !important",
                          }}
                        >
                          30-09-2024
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body1"
                        sx={{ mt: 1, color: "#5d5c5c" }}
                      >
                        Wearing a Banarsi sari feels like draping a piece of
                        heritage. The craftsmanship and elegance are unmatched.
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Soluta eum officiis, facere libero esse sit
                        commodi odio autem nihil aliquid odit atque minus
                        possimus magni
                      </Typography>
                    </Box>
                  </Box>
                </div>
              </CustomTabPanel>

              <CustomTabPanel value={value} index={3}>
                <div className="ask_question">
                  <div>
                    <input
                      type="text"
                      placeholder="Ask any question here"
                    ></input>
                    <button>Submit</button>
                  </div>
                </div>
              </CustomTabPanel>
            </article>
          </section>
        </div>
        {/* <section>
          <ProductSection
            productCategorySection={similar_product}
            bgColor={"#fff"}
          />
        </section>
        <section>
          <ProductSection
            productCategorySection={you_may_also_like}
            bgColor={"#fff"}
          />
        </section> */}
      </div>
    </ThemeProvider>
  );
}
