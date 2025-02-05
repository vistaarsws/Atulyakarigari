import { useNavigate, useParams } from "react-router-dom";
import ProductView from "../../../components/layout/user/product-view/ProductView";
import share from "../../../assets/images/share.svg";
import star from "../../../assets/images/reviewStar.svg";
import { Breadcrumb } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
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
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useRef } from "react";
import { logEvent } from "../../../utils/analytics/analytics";

import "./Product.css";
import WishListHeartIcon from "../../../components/ui/micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useState } from "react";
// import ProductSection from "../../../components/layout/user/product-section/ProductSection";
import {
  getProductById,
  getReviewById,
  deleteReview,
  createOrUpdateReview,
  getCart,
  addToCart,
  removeFromCart,
} from "../../../../src/services/user/userAPI";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

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

  const startTime = useRef(null); // Track when the user enters the page
  const [product, setProduct] = useState(null);
  const fetchProduct = async () => {
    const response = await getProductById(productId);
    setProduct(response?.data?.data);
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
    };
  }, [productId]); // Track changes to the product ID in case the route changes

  // RATING AND REVIEW START //

  const authToken = useSelector((state) => state.auth.token);
  const [ratingAndReview, setRatingAndReview] = useState({
    reviews: [],
    averageRating: "N/A",
  });
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [userReview, setUserReview] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch reviews and update the state
  const fetchRatingAndReview = async () => {
    try {
      if (!authToken) {
        console.error("Error: No user profile token found");
        return;
      }

      const decodedToken = jwtDecode(authToken);
      if (!decodedToken || !decodedToken._id) {
        console.error("Error: Invalid token structure");
        return;
      }

      const response = await getReviewById(productId);

      const reviews = response?.data?.data?.reviews;

      const existingReview = reviews.find(
        (review) => review?.userId === decodedToken?._id
      );
      if (existingReview) {
        setUserReview(existingReview);
      }

      const totalReviews = reviews?.length;
      const totalRating =
        totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0)
          : 0;
      const averageRating =
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "N/A";

      const updatedReviews = reviews.map((review) => ({
        ...review,
        userName: review?.userName || "Anonymous",
        userImage: review?.userImage || review_person,
      }));

      setRatingAndReview({ reviews: updatedReviews, averageRating });
    } catch (error) {
      console.error("Unexpected error in fetchRatingAndReview:", error);
    }
  };

  // Handle changes in the review form fields
  const handleChangeReview = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle review submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!authToken) {
        console.error("Error: No user profile token found");
        return;
      }

      const decodedToken = jwtDecode(authToken);
      const userId = decodedToken?._id;
      if (!userId) {
        console.error("Error: Invalid token structure");
        return;
      }

      let { rating, comment } = formData;
      let response;

      if (editingReviewId) {
        // Update review
        response = await createOrUpdateReview(productId, rating, comment);
      } else {
        // Create new review
        response = await createOrUpdateReview(productId, rating, comment);
      }

      if (response?.data?.success) {
        alert(
          editingReviewId
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        fetchRatingAndReview();
        setFormData({ rating: 5, comment: "" });
        setEditingReviewId(null);
      } else {
        console.error("Error submitting review:", response);
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a review
const handleDeleteReview = async (reviewId) => {
  try {
    if (!reviewId) {
      console.error("Error: Review ID is required");
      alert("Review ID is missing!");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmation) return;

    const response = await deleteReview(reviewId);

    if (response?.success) {
      alert("Review deleted successfully!");
      // Optionally refetch reviews or update the UI to reflect the deletion
      fetchRatingAndReview(); // Assuming this is a function in your component to fetch reviews
    } else {
      console.error("Failed to delete review:", response);
      alert("Failed to delete review. Please try again later.");
    }
  } catch (error) {
    console.error("Unexpected error in handleDeleteReview:", error);
    alert("An error occurred while deleting the review.");
  }
};

  

  // Toggle showing more reviews
  const handleToggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  // Handle editing a review (pre-fill the form)
  const handleEditReview = (review) => {
    setFormData({ rating: review.rating, comment: review.comment });
    setEditingReviewId(review._id || review.id);
  };

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        console.error("Error: No user profile token found");
        return;
      }

      const decodedToken = jwtDecode(authToken);
      if (!decodedToken || !decodedToken._id) {
        console.error("Error: Invalid token structure");
        return;
      }

      await fetchRatingAndReview();
    };

    fetchData();
  }, []);

  // // Fetch reviews on component mount
  // useEffect(() => {
  //   fetchRatingAndReview();
  // }, []);

  // RATING AND REVIEW END //

  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkIfProductInCart = async () => {
    try {
      const cart = await getCart();
      const items = cart?.data?.data?.items;

      const productInCart = items.some((item) => item.productId === productId);
      setIsInCart(productInCart);
    } catch (error) {
      console.error("Error checking cart status:", error);
    }
  };

  useEffect(() => {
    checkIfProductInCart();
  }, [productId]);

  const handleCartToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      isInCart ? await removeFromCart(productId) : await addToCart(productId);
      setIsInCart(!isInCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoading(false);
    }
  };

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
                    <span>{ratingAndReview.averageRating}</span>
                    <img src={star} alt="Star" />
                  </div>
                  <div>{ratingAndReview.reviews.length} Ratings</div>
                </div>
                <div className="pincodeBox">
                  <div>
                    <input
                      type="text" //
                      name="pincode"
                      id="pincode"
                      inputMode="numeric"
                      pattern="[0-6]*"
                      placeholder="Enter Pincode"
                      style={{
                        appearance: "textfield",
                        MozAppearance: "textfield",
                        WebkitAppearance: "none",
                      }}
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
                  return (
                    <li key={index}>
                      <div>{property.key}</div>
                      {property?.value?.map((val, i) => (
                        <span key={i}>
                          {i > 0 && " / "}
                          {val}
                        </span>
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
                <button onClick={handleCartToggle} disabled={loading}>
                  {isInCart ? "Remove From Cart" : "Add to Cart"}
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
                  {ratingAndReview.reviews.length > 0 ? (
                    <>
                      {ratingAndReview.reviews
                        .slice(
                          0,
                          showAllReviews ? ratingAndReview.reviews.length : 1
                        )
                        .map((review, index) => (
                          <Box
                            key={review[index]?._id}
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              borderBottom: "1px solid #e0e0e0",
                              width: "100%",
                              padding: "1rem",
                              borderRadius: "8px",
                            }}
                          >
                            <Avatar
                              alt={review.userName}
                              src={review.userImage || "/default-avatar.png"}
                              sx={{
                                width: 56,
                                height: 56,
                                marginBottom: "auto",
                              }}
                            />
                            <Box sx={{ ml: 2, flex: 1 }}>
                              <Stack
                                display="grid"
                                marginTop="1rem"
                                gridTemplateColumns="1fr 1fr"
                                direction="row"
                                alignItems="center"
                                justifyContent="start"
                                spacing={1}
                              >
                                <Rating
                                  name="read-only"
                                  value={review.rating}
                                  readOnly
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "1.2rem" }}
                                >
                                  - {review.userName}
                                </Typography>
                                <Typography
                                  sx={{
                                    margin: "0 !important",
                                    textAlign: "right",
                                    fontSize: "1.2rem !important",
                                  }}
                                >
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </Typography>
                              </Stack>
                              <Typography
                                variant="body1"
                                sx={{ mt: 1, color: "#5d5c5c" }}
                              >
                                {review.comment}
                                {userReview &&
                                  review.userId === userReview.userId && (
                                    <>
                                      <Button
                                        onClick={() => handleEditReview(review)}
                                        sx={{
                                          marginLeft: "10px",
                                          padding: "5px",
                                          cursor: "pointer",
                                        }}
                                        startIcon={<EditIcon />}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleDeleteReview(review._id)
                                        }
                                        sx={{
                                          marginLeft: "10px",
                                          padding: "5px",
                                          cursor: "pointer",
                                          color: "error.main",
                                        }}
                                        startIcon={<DeleteIcon />}
                                      >
                                        Delete
                                      </Button>
                                    </>
                                  )}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      <Button
                        onClick={handleToggleReviews}
                        sx={{
                          display: "block",
                          margin: "1rem auto",
                          color: "primary.main",
                          textTransform: "none",
                        }}
                      >
                        {showAllReviews ? "View Less" : "View More"}
                      </Button>
                    </>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", mt: 2 }}
                    >
                      No reviews yet.
                    </Typography>
                  )}

                  {/* Review Form Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {editingReviewId ? "Edit Your Review" : "Leave a Review"}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={2}>
                        {/* Rating Input */}
                        <Rating
                          name="rating"
                          value={formData.rating}
                          onChange={(event, newValue) => {
                            setFormData((prev) => ({
                              ...prev,
                              rating: newValue,
                            }));
                          }}
                          sx={{ fontSize: "2rem" }}
                        />

                        <TextField
                          name="comment"
                          label="Your Review"
                          variant="outlined"
                          value={formData.comment} // This value gets updated when user clicks edit
                          onChange={handleChangeReview}
                          multiline
                          rows={4}
                          fullWidth
                          placeholder="Your review here..." // Placeholder text for the input field
                          sx={{ marginBottom: "1rem" }}
                        />

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={loading}
                        >
                          {editingReviewId ? "Update Review" : "Submit Review"}
                        </Button>
                      </Stack>
                    </form>
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
      </div>
    </ThemeProvider>
  );
}
