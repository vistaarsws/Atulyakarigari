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
import { useSnackbar } from "notistack";
import ConfirmationModal from "../../../components/ui/modal/confirmation-modal/ConfirmationModal";

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
  getQuestionsByProduct,
  askQuestion,
  getUserWishlist,
  getServiceability,
} from "../../../../src/services/user/userAPI";
import { answerQuestion } from "../../../../src/services/admin/adminAPI";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { fetchCart } from "../../../Redux/features/CartSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [formData, setFormData] = useState({ rating: 0, comment: "" });
  const [userReview, setUserReview] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const authToken = useSelector((state) => state.auth.token);
  const [ratingAndReview, setRatingAndReview] = useState({
    reviews: [],
    averageRating: "0 ",
  });
  const [value, setValue] = useState(0);

  const handleOpenConfirm = (reviewId) => {
    setReviewToDelete(reviewId);
    setOpenConfirm(true);
  };

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

  const fetchRatingAndReview = async () => {
    try {
      const decodedToken = jwtDecode(authToken);

      const response = await getReviewById(productId);

      setReviewData(response?.data?.data);

      const reviews = response?.data?.data?.reviews;

      const existingReview = reviews.find(
        (review) => review?.userId === decodedToken?._id
      );
      if (existingReview) {
        setUserReview(existingReview);
      }

      const updatedReviews = reviews.map((review) => ({
        ...review,
        userName: review?.userName || "Anonymous",
        userImage: review?.userImage || review_person,
      }));

      setRatingAndReview((preRev) => ({ ...preRev, reviews: updatedReviews }));
    } catch (error) {
      console.error("Unexpected error in fetchRatingAndReview:", error);
    }
  };

  const handleChangeReview = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let { rating, comment } = formData;

      if (!rating || !comment.trim()) {
        enqueueSnackbar("Please provide a rating and comment.", {
          variant: "warning",
        });
        setLoading(false);
        return;
      }

      let response;

      if (editingReviewId) {
        response = await createOrUpdateReview(productId, rating, comment);
      } else {
        response = await createOrUpdateReview(productId, rating, comment);
      }

      if (response?.data?.success) {
        enqueueSnackbar(
          editingReviewId
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          { variant: "success" }
        );

        fetchRatingAndReview();
        setFormData({ rating: 5, comment: "" });
        setEditingReviewId(null);
      } else {
        enqueueSnackbar("Error submitting review. Please try again.", {
          variant: "error",
        });
        console.error("Error submitting review:", response);
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong! Please try again.", {
        variant: "error",
      });
      console.error("Unexpected error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setOpenConfirm(false);
    if (!reviewToDelete) return;

    try {
      const response = await deleteReview(reviewToDelete);
      if (response?.success) {
        enqueueSnackbar("Review deleted successfully!", { variant: "success" });
        fetchRatingAndReview();
      } else {
        enqueueSnackbar("Failed to delete review. Please try again later.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while deleting the review.", {
        variant: "error",
      });
    }
  };

  const handleToggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleEditReview = (review) => {
    setFormData({ rating: review.rating, comment: review.comment });
    setEditingReviewId(review._id || review.id);
  };

  useEffect(() => {
    fetchRatingAndReview();
    // fetchData();
  }, [authToken]);

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

    if (authToken) {
      try {
        isInCart
          ? await removeFromCart(productId)
          : await addToCart(productId, 1);
        setIsInCart(!isInCart);
        dispatch(fetchCart(authToken));
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Please Login First", {
        variant: "error",
      });
    }
  };

  // buy now button
  const handleBuyToggle = () => {
    if (authToken) {
      navigate("/place-order", { state: { productId } });
    } else {
      enqueueSnackbar("Please Login to Buy Product", {
        variant: "error",
      });
    }
  };

  // START Share Product

  const productUrl = `${window.location.origin}/product/${productId}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this product: ${product?.name}`,
          url: productUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      enqueueSnackbar("Sharing not supported in this browser.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchRatingAndReview();
  }, []);

  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);

  const fetchQuestionsAndAnswers = async () => {
    try {
      const response = await getQuestionsByProduct(productId);
      setQuestionsAndAnswers(response?.data.questions);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchQuestionsAndAnswers();
  }, [productId]);

  useEffect(() => {}, [questionsAndAnswers]);

  const [newQuestion, setNewQuestion] = useState("");

  const handleAskQuestion = async () => {
    if (newQuestion.length < 5) {
      enqueueSnackbar("Question must be at least 5 characters long.", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await askQuestion(productId, newQuestion);
      if (response?.data?.success === true) {
        enqueueSnackbar("Question submitted successfully!", {
          variant: "success",
        });
        setNewQuestion("");
        fetchQuestionsAndAnswers();
      } else {
        enqueueSnackbar(response?.message || "Failed to submit question.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      enqueueSnackbar("An error occurred while submitting your question.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [adminAnswer, setAdminAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [role, setRole] = useState("");

  const handleAnswerSubmit = async () => {
    setLoading(true);
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

    if (decodedToken) {
      setRole(decodedToken?.role);
    }

    if (!adminAnswer || !selectedQuestionId) {
      enqueueSnackbar("Please select a question and provide an answer.", {
        variant: "error",
      });
      setLoading(false);
      return;
    }

    let answer = adminAnswer;
    let questionId = selectedQuestionId;

    try {
      const response = await answerQuestion(answer, questionId, productId);

      if (response?.status == 200) {
        enqueueSnackbar("Answer submitted successfully!", {
          variant: "success",
        });
        setAdminAnswer("");
        setSelectedQuestionId("");
        fetchQuestionsAndAnswers();
      } else {
        enqueueSnackbar(response?.message || "Failed to submit answer.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      enqueueSnackbar("An error occurred while submitting your answer.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [deliveryEstimation, setDeliveryEstimation] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const handleServiceability = async () => {
    if (!deliveryPincode) {
      enqueueSnackbar("Delivery pincodes is required.", {
        variant: "error",
      });
      return;
    }
    let productId = product._id;
    let delivery_postcode = deliveryPincode;
    let cod = false;

    const response = await getServiceability(productId, delivery_postcode, cod);
    setDeliveryEstimation(response);
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
                <WishListHeartIcon productId={productId} />
                <figure
                  onClick={handleNativeShare}
                  style={{ cursor: "pointer" }}
                >
                  <img src={share} alt="Share" />
                </figure>
              </div>
            </div>
            {/* <p>{product?.description || "No Description"}</p> */}
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
                  {product?.discountPercentage > 0 && (
                    <>
                      <strike>₹{product?.price || "N/A"}</strike>
                      <h4>(-{product?.discountPercentage}%)</h4>
                    </>
                  )}
                </div>

                <div className="ratingBox">
                  <div>
                    <span>{reviewData?.averageRating}</span>
                    <img src={star} alt="Star" />
                  </div>
                  <div>{reviewData?.totalReviews} Ratings</div>
                </div>
                <div className="pincodeBox">
                  <div>
                    <input
                      type="text" //
                      name="Pincode"
                      id="Pincode"
                      inputMode="numeric"
                      pattern="[0-6]*"
                      placeholder="Enter Pincode"
                      value={deliveryPincode}
                      onChange={(e) => setDeliveryPincode(e.target.value)}
                      style={{
                        appearance: "textfield",
                        MozAppearance: "textfield",
                        WebkitAppearance: "none",
                      }}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleServiceability()}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
              {deliveryEstimation?.data?.message?.fastest_delivery
                ?.estimated_delivery && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    color: "green",
                    fontSize: "16px",
                    marginTop: "2vh",
                  }}
                >
                  Estimated Delivery :{" "}
                  {
                    deliveryEstimation?.data?.message?.fastest_delivery
                      ?.estimated_delivery
                  }
                </Box>
              )}
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
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "10px",
                  margin: 0,
                }}
              >
                <li>
                  <em style={{ fontSize: "14px" }}>
                    {product?.expectedReturnDate > 0
                      ? `Easy ${product.expectedReturnDate} days returns and exchanges`
                      : "No Return"}
                  </em>
                </li>
              </ul>
            </article>
            <article className="product_details_userInputs">
              <div>
                <button onClick={handleBuyToggle}>Buy Now</button>
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
                    {product?.detailDescription?.map((item, index) => (
                      <li key={index}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <div className="reviews_section">
                  {reviewData?.reviews?.length > 0 ? (
                    <>
                      {reviewData?.reviews
                        .slice(
                          0,
                          showAllReviews ? reviewData.reviews.length : 1
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
                                  sx={{
                                    margin: "0 8px 0 0 !important",

                                    textAlign: "right",
                                    fontSize: "1.2rem !important",
                                  }}
                                >
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "1.2rem" }}
                                >
                                  - {review.userName}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {userReview &&
                                    review.userId === userReview.userId && (
                                      <>
                                        <Button
                                          onClick={() =>
                                            handleEditReview(review)
                                          }
                                          sx={{
                                            minWidth: "unset",
                                            "& .MuiButton-startIcon": {
                                              margin: 0,
                                            },
                                          }}
                                          startIcon={<EditIcon />}
                                        ></Button>
                                        <Button
                                          onClick={() =>
                                            handleOpenConfirm(review._id)
                                          }
                                          sx={{
                                            minWidth: "unset",
                                            color: "error.main",
                                            "& .MuiButton-startIcon": {
                                              margin: 0,
                                            },
                                          }}
                                          startIcon={<DeleteIcon />}
                                        ></Button>
                                      </>
                                    )}
                                </Box>
                              </Stack>
                              <Typography
                                variant="body1"
                                sx={{ mt: 1, color: "#5d5c5c" }}
                              >
                                {review.comment}
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
                  {authToken && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        {editingReviewId
                          ? "Edit Your Review"
                          : "Leave a Review"}
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
                            variant="outlined"
                            sx={{
                              color: "#ad3f38",
                              border: "1px solid #ad3f38",
                              "&:hover": {
                                bgcolor: "unset ",
                              },
                            }}
                            disabled={loading}
                          >
                            {editingReviewId
                              ? "Update Review"
                              : "Submit Review"}
                          </Button>
                        </Stack>
                      </form>
                    </Box>
                  )}
                </div>
                <ConfirmationModal
                  open={openConfirm}
                  onClose={() => setOpenConfirm(false)}
                  onConfirm={handleDeleteConfirmed}
                  title="Delete Review"
                  message="Are you sure you want to delete this review?"
                />
              </CustomTabPanel>

              <CustomTabPanel value={value} index={3}>
                <div className="ask_question">
                  {/* Fetch and Set Role Once */}
                  {authToken &&
                    !role &&
                    (() => {
                      const decodedToken = jwtDecode(authToken);
                      setRole(decodedToken?.role || "");
                    })()}

                  {/* Input Field for Question */}
                  <div>
                    <input
                      type="text"
                      placeholder="Ask any question here"
                      value={newQuestion} // Bind state
                      onChange={(e) => setNewQuestion(e.target.value)} // Update state dynamically
                    />
                    <button onClick={handleAskQuestion} disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                  {/* Questions and Answers List */}
                  {questionsAndAnswers.length > 0 ? (
                    questionsAndAnswers.map((item) => (
                      <div key={item._id} className="question-container">
                        <div className="question">
                          <h3>Q: {item.question}</h3>
                        </div>
                        <div className="answer">
                          {item.answer ? (
                            <h3>A: {item.answer}</h3>
                          ) : (
                            <>
                              <p className="no-answer">
                                No answer provided yet.
                              </p>
                              {role === "admin" && ( // Ensure the role is checked correctly
                                <div className="admin-answer">
                                  <input
                                    type="text"
                                    placeholder="Write your answer..."
                                    value={
                                      selectedQuestionId === item._id
                                        ? adminAnswer
                                        : ""
                                    }
                                    onChange={(e) => {
                                      setAdminAnswer(e.target.value);
                                      setSelectedQuestionId(item._id);
                                    }}
                                  />
                                  <button
                                    onClick={handleAnswerSubmit}
                                    disabled={
                                      loading || selectedQuestionId !== item._id
                                    }
                                  >
                                    {loading && selectedQuestionId === item._id
                                      ? "Submitting..."
                                      : "Submit"}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No questions asked yet. Be the first to ask!</p>
                  )}
                </div>
              </CustomTabPanel>
            </article>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
