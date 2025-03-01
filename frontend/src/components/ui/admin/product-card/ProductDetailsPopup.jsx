import React, { useState } from "react";
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
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  TextField,
  DialogActions,
  Button,
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
  updateQuestionAndAnswer,
} from "../../../../services/admin/adminAPI";

// TabPanel Component for managing Tab content
function TabPanel({ value, index, children }) {
  return value === index && <Box>{children}</Box>;
}

// Main Product Details Popup
export default function ProductDetailsPopup({ open, handleClose, product }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);

  const [questionOpen, setQuestionOpen] = useState(false);
  const [selectedQA, setSelectedQA] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  const editQuestionHandler = (qa) => {
    setSelectedQA(qa);
    setEditedQuestion(qa.question);
    setEditedAnswer(qa.answer);
    setQuestionOpen(true);
  };

  const handleSave = () => {
    updateQuestion(selectedQA._id, editedQuestion, editedAnswer);
    setQuestionOpen(false);
  };

  if (!product) return null;
  console.log("product", product);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const deleteRatingAndReviewHandler = async (id) => {
    try {
      await deleteReviewAndRating(id);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteQuestionHandler = async (id) => {
    try {
      await deleteQuestion(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestionSave = async () => {
    try {
      console.log("selec", selectedQA);
      await updateQuestionAndAnswer(selectedQA._id, {
        question: editedQuestion,
        answer: editedAnswer,
      });
    } catch (error) {
      console.log(error);
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
          {product.name}
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
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[1],
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: theme.shadows[3],
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="primary"
                      >
                        Q: {qa.question}
                      </Typography>
                    }
                    secondary={
                      <Typography color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                        A: {qa.answer}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
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
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <Dialog
                open={questionOpen}
                onClose={() => setQuestionOpen(false)}
              >
                <DialogTitle>Edit Q&A</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    label="Question"
                    margin="dense"
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                  />
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
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleQuestionSave} color="primary">
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
          <List sx={{ p: 0 }}>
            {product?.ratingAndReviews?.map((review, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                  p: 2,
                  mb: 2,
                  "&:hover": { boxShadow: 3 },
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
                    <MuiIconButton size="small" sx={{ mr: 1 }}>
                      <EditIcon />
                    </MuiIconButton>
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
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
