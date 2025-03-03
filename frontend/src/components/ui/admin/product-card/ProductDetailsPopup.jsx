import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  IconButton as MuiIconButton,
  TextField,
  DialogActions,
  Button,
  useControlled,
} from "@mui/material";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ProductForm from "../../../layout/admin/product-form/ProductForm";
import {
  deleteReviewAndRating,
  deleteQuestion,
  answerQuestion,
} from "../../../../services/admin/adminAPI";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";
// import { fetchAllQuestions } from "../../../../Redux/features/ReviewAndQuestionSlice";
// import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";

// TabPanel Component for managing Tab content
function TabPanel({ value, index, children }) {
  return value === index && <Box>{children}</Box>;
}

// Main Product Details Popup
export default function ProductDetailsPopup({ open, handleClose, productId }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);

  const [questionOpen, setQuestionOpen] = useState(false);
  const [selectedQA, setSelectedQA] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  const product = useSelector((state) => state.products.products).find(
    (prod) => prod?._id == productId
  );

  const editQuestionHandler = (qa) => {
    setSelectedQA(qa);
    setEditedQuestion(qa.question);
    setEditedAnswer(qa.answer);
    setQuestionOpen(true);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const deleteRatingAndReviewHandler = async (id) => {
    try {
      const res = await deleteReviewAndRating(id);
      if (res.status === 200) {
        dispatch(fetchAllProducts());
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteQuestionHandler = async (id) => {
    try {
      const res = await deleteQuestion({ questionId: id });
      if (res.status === 200) {
        dispatch(fetchAllProducts());
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAnswerSave = async () => {
    try {
      const res = await answerQuestion(editedAnswer, selectedQA?._id);
      if (res.status === 200) {
        dispatch(fetchAllProducts());
      }
      setQuestionOpen(false);
    } catch (error) {
      console.log(error);
      setQuestionOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#ebe7f5",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#6f6f6f" }}>
          {product?.name}
        </Typography>
        <Box>
          <IconButton onClick={handleClose} sx={{ color: "#6f6f6f" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Tabs for navigation */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            color: "rgba(0, 0, 0, 0.6)", // Change the text color of the tabs
            fontSize: "1rem",
          },
          "& .MuiTab-selected": {
            backgroundColor: "blue", // Change the background color of the selected tab
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#5f3dc3", // Change the indicator (underline) color
          },
        }}
      >
        <Tab label="Product Details" />
        <Tab label="Q&A" />
        <Tab label="Reviews" />
      </Tabs>

      {/* Tab Content */}
      <DialogContent sx={{ p: isMobile ? 2 : 4, scrollbarWidth: "none" }}>
        {/* Product Details */}
        <TabPanel value={tabIndex} index={0}>
          <ProductForm
            productDetails={product}
            isProductEditing={true}
            closeDialog={handleClose}
          />
        </TabPanel>

        {/* Q&A */}
        <TabPanel value={tabIndex} index={1}>
          {product?.questions?.length > 0 ? (
            <List sx={{ p: 0 }}>
              {product?.questions?.map((qa, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: "background.paper",
                    mb: 2,
                    borderRadius: "4px",
                    border: "1px solid #cccccc",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow:
                        "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          color: "#ad3f38",
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        Q: {qa.question}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        color="text.secondary"
                        sx={{ mt: 1, ml: 2, fontSize: "14px" }}
                      >
                        {qa.answer}
                      </Typography>
                    }
                  />
                  <MuiIconButton
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => editQuestionHandler(qa)}
                  >
                    <EditIcon />
                  </MuiIconButton>
                  <MuiIconButton
                    size="small"
                    color="error"
                    onClick={() => deleteQuestionHandler(qa._id)}
                  >
                    <DeleteIcon />
                  </MuiIconButton>
                </ListItem>
              ))}
              <Dialog
                open={questionOpen}
                onClose={() => setQuestionOpen(false)}
              >
                <DialogTitle sx={{ fontSize: "16px", color: "#5f3dc3" }}>
                  Answer/Edit Questions
                </DialogTitle>
                <DialogContent>
                  <Typography sx={{ fontSize: "14px", mb: 2 }}>
                    {selectedQA?.question}
                  </Typography>

                  <TextField
                    fullWidth
                    label="Answer"
                    margin="dense"
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setQuestionOpen(false)}
                    variant="contained"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAnswerSave}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </List>
          ) : (
            <Typography color="text.secondary">
              No questions available
            </Typography>
          )}
        </TabPanel>

        {/* Reviews */}
        <TabPanel value={tabIndex} index={2}>
          {product?.ratingAndReviews?.length > 0 ? (
            <List sx={{ p: 0 }}>
              {product?.ratingAndReviews?.map((review, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: "4px",
                    border: "1px solid #cccccc",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow:
                        "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                    },

                    bgcolor: "background.paper",

                    p: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                      {review.userName?.[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.userName}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                    </Box>
                    <Box>
                      {/* <MuiIconButton size="small" sx={{ mr: 1 }}>
                      <EditIcon />
                    </MuiIconButton> */}
                      <MuiIconButton
                        size="small"
                        color="error"
                        onClick={() => deleteRatingAndReviewHandler(review._id)}
                      >
                        <DeleteIcon />
                      </MuiIconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 7 }}
                  >
                    {review.comment}
                  </Typography>
                </Box>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No Reviews available</Typography>
          )}
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
