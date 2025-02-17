import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Rating,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  styled,
  useTheme
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  QuestionAnswer as QAIcon,
  Star as StarIcon,
  Info as InfoIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon
} from "@mui/icons-material";
import { deleteProduct } from "../../../../services/user/userAPI";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";

// Enhanced styled components with better transitions and effects
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
  },
  '& .MuiDialogTitle-root': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 3),
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  minHeight: 48,
  textTransform: 'none',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  '& .MuiSvgIcon-root': {
    marginBottom: '4px !important',
  },
}));

const ImageContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
}));

const ImagePreview = styled('img')({
  width: '100%',
  height: 400,
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
});

const ImageNavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  zIndex: 1,
}));

const AttributeCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

export default function ProductDetailsPopup({ open, handleClose, product }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
console.log("product", product);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product._id);
      dispatch(fetchAllProducts());
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (!product) return null;

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {product.name}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ImageContainer elevation={3}>
              <ImageNavigationButton
                onClick={() => handleImageNavigation('prev')}
                sx={{ left: theme.spacing(2) }}
              >
                <PrevIcon />
              </ImageNavigationButton>
              <ImagePreview
                src={product.images[currentImageIndex]}
                alt={`Product ${currentImageIndex + 1}`}
              />
              <ImageNavigationButton
                onClick={() => handleImageNavigation('next')}
                sx={{ right: theme.spacing(2) }}
              >
                <NextIcon />
              </ImageNavigationButton>
            </ImageContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {product.images.map((_, index) => (
                <Button
                  key={index}
                  variant={currentImageIndex === index ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    p: 0,
                    borderRadius: '50%',
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ '& .MuiTabs-indicator': { height: 3 } }}
              >
                <StyledTab icon={<InfoIcon />} label="Details" />
                <StyledTab icon={<QAIcon />} label="Q&A" />
                <StyledTab icon={<StarIcon />} label="Reviews" />
              </Tabs>
            </Box>

            <TabPanel value={tabIndex} index={0}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                {product.description}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Specifications
              </Typography>
              <Grid container spacing={2}>
                {product.attributes.map((attr) => (
                  <Grid item xs={12} sm={6} key={attr._id}>
                    <AttributeCard>
                      <CardContent>
                        <Typography
                          color="primary"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {attr.key}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {attr.value.join(", ")}
                        </Typography>
                      </CardContent>
                    </AttributeCard>
                  </Grid>
                ))}
              </Grid>

              {product.artisanName && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Artisan
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: theme.shape.borderRadius * 2,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item>
                        <Avatar
                          src={product.artisanImage}
                          sx={{
                            width: 80,
                            height: 80,
                            border: `4px solid ${theme.palette.primary.main}`,
                          }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {product.artisanName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.artisanAbout}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabIndex} index={1}>
              <List sx={{ p: 0 }}>
                {product.questions?.map((qa, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 2,
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: theme.shadows[1],
                      transition: 'all 0.2s ease',
                      '&:hover': {
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
                          Q: {qa.questions}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          color="text.secondary"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          A: {qa.answer}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabIndex} index={2}>
              <List sx={{ p: 0 }}>
                {product?.reviews?.map((review, index) => (
                  
                  <ReviewCard key={index}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
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
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 7 }}
                    >
                      {review.comment}
                    </Typography>
                  </ReviewCard>
                ))}
              </List>
            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Chip
          label={`Stock: ${product.stock}`}
          color={product.stock > 0 ? "success" : "error"}
          sx={{
            mr: 'auto',
            fontWeight: 'bold',
            height: 32,
          }}
        />
        <Chip
          label={`₹${product.priceAfterDiscount}`}
          color="primary"
          sx={{
            mr: 2,
            fontWeight: 'bold',
            height: 32,
          }}
        />
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: theme.shape.borderRadius,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}