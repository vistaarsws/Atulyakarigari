import Product from "../models/product.js";
import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import Question from "../models/Question.js";
import RatingAndReviews from "../models/ratingAndReviews.js";
import mongoose from "mongoose";
import {
  badRequest,
  internalServerError,
  notFoundRequest,
  success,
} from "../helpers/api-response.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/image-uploder/index.js";
import {
  addProductToShiprocket,
  getAllProductsShipRocket,
} from "../utils/shiprocket-service/shiprocket.js";

const calculateDiscountedPrice = (price, discountPercentage) => {
  return price * (1 - discountPercentage / 100);
};

export const getAllProducts = async (req, res) => {
  try {
   
    

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };

    // Fetch products
    const products = await Product.find(filter)
      .lean(); // Converts MongoDB documents into plain JavaScript objects

    // Fetch reviews for each product
    const productIds = products.map((product) => product._id);
    const reviews = await RatingAndReviews.find({ productId: { $in: productIds } })
      .populate("userId", "name")
      .select("rating comment userId productId")
      .lean();

    // Attach reviews to corresponding products
    const productsWithReviews = products.map((product) => ({
      ...product,
      ratingAndReviews: reviews.filter((review) => review.productId.toString() === product._id.toString()),
    }));

    const total = await Product.countDocuments(filter);

    return success(req, res, "Products fetched successfully", {
      count: productsWithReviews.length,
     
      products: productsWithReviews,
    });
  } catch (error) {
    return internalServerError(req, res, error, "Unable to fetch products");
  }
};

export const createProduct = async (req, res) => {
  let session;
  try {
    // Destructure and validate input
    const {
      name,
      detailDescription,
      price,
      category,
      subcategory,
      _attributes,
      sku,
      weight,
      length,
      width,
      height,
      stock,
      status,
      discountPercentage,
      artisanName,
      artisanAbout,
    } = req.body;

    if (!req.files || !req.files.productImage) {
      return badRequest(req, res, null, "product image is required");
    }
    // if (!req.files.artisanImage) {
    //     return badRequest(req, res, null, "artisan image is required");
    // }
    //  input validation
    if (
      !name ||
      !price ||
      !category ||
      !sku ||
      !weight ||
      !length ||
      !width ||
      !height ||
      !stock ||
      !status ||
      !detailDescription ||
      !_attributes ||
      !discountPercentage
      //  || !artisanName || !artisanAbout
    ) {
      return badRequest(req, res, null, "fields are missing");
    }
    const attributes = JSON.parse(_attributes);

    const _detailDescription = JSON.parse(detailDescription);
    if (!attributes || !Array.isArray(attributes)) {
      return badRequest(req, res, null, "Invalid Attributes");
    }
    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return badRequest(req, res, null, "Category not found");
    }

    // Optional: Validate subcategory if provided
    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return badRequest(req, res, null, "Invalid subcategory ");
      }

      const existingSubcategory = await SubCategory.findById(subcategory);
      if (!existingSubcategory) {
        return notFoundRequest(req, res, null, "subcategory not found");
      }

      // Verify subcategory belongs to the selected category
      if (!existingSubcategory.parentCategory.equals(category)) {
        return badRequest(
          req,
          res,
          null,
          "subcategory does not belong to the selected category"
        );
      }
    }

    // Start mongoose transaction
    session = await mongoose.startSession();
    session.startTransaction();
    const productImages = [];
    const imagePromises = req.files.productImage.map(async (image) => {
      try {
        const uploadedImage = await uploadImageToCloudinary(image, "product");
        if (uploadedImage && uploadedImage.url) {
          return uploadedImage.url;
        }
      } catch (error) {
        console.error(`Error uploading image: ${image.originalname}`, error);
        // Handle individual image errors, or return a failure response
        return null;
      }
    });
    // Use Promise.all to upload images in parallel, then filter out any failed uploads
    const uploadedUrls = await Promise.all(imagePromises);
    const validUrls = uploadedUrls.filter((url) => url !== null);

    // If no images were successfully uploaded, return an error
    if (validUrls.length === 0) {
      return internalServerError(
        req,
        res,
        null,
        "Failed to upload product images"
      );
    }

    productImages.push(...validUrls);
    // artisan Image upload
    const artisanPicture = await uploadImageToCloudinary(
      req.files.artisanImage,
      "artisan"
    );
    const priceAfterDiscount = calculateDiscountedPrice(
      price,
      discountPercentage
    );
    //  product data
    const productData = {
      name: name.trim(),
      _detailDescription,
      price,
      category,
      subcategory: subcategory || null,
      sku,
      weight,
      length,
      width,
      height,
      attributes,
      stock,
      status,
      discountPercentage,
      priceAfterDiscount,
      images: productImages,
      artisanName,
      artisanAbout,
      artisanImage: artisanPicture.url,
    };

    // Create product,
    const product = await Product.create([productData], { session });

    // Verify product creation
    if (!product || product.length === 0) {
      return internalServerError(req, res, null, "'Failed to create product'");
    }

    // Update category references
    const updatedCategory = await Category.findByIdAndUpdate(
      category,
      {
        $addToSet: { products: product[0]._id },
        $set: { updatedAt: new Date() },
      },
      { session, new: true }
    );

    // Update subcategory references if exists
    let updatedSubcategory;
    if (subcategory) {
      updatedSubcategory = await SubCategory.findByIdAndUpdate(
        subcategory,
        {
          $addToSet: { products: product[0]._id },
          $set: { updatedAt: new Date() },
        },
        { session, new: true }
      );
    }

    // Add product to Shiprocket
    await addProductToShiprocket(productData);

    // Commit transaction
    await session.commitTransaction();
    const response = product[0].toObject();

    // Respond with created product
    return success(req, res, "product created successfully", response);
  } catch (error) {
    // Abort transaction if it exists
    console.log(error);
    if (session) {
      await session.abortTransaction();
    }
    return internalServerError(req, res, error, "unable to create product");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return badRequest(req, res, null, "Invalid or missing product ID");
    }

    // Fetch product details
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate({
        path: "subcategory",
        model: "SubCategory",
        options: { strictPopulate: false },
        select: "name",
      })
      .lean();

    if (!product) {
      return notFoundRequest(req, res, null, "Product not found");
    }

    // Fetch related ratingAndReviews and questions
    const [ratingAndReviews, questions] = await Promise.all([
      RatingAndReviews.find({ productId: id })
        .populate("userId", "name")
        .select("rating comment userId")
        .lean(),
      Question.find({ productId: id })
        .populate("userId", "name")
        .populate("answeredBy", "name")
        .select("question answer userId answeredBy")
        .lean(),
    ]);

    return success(req, res, "Product fetched successfully", {
      ...product,
      ratingAndReviews,
      questions,
    });
  } catch (error) {
    return internalServerError(req, res, error, "Unable to get product");
  }
};

export const updateProduct = async (req, res) => {
  let session;
  try {
    const {
      name,
      sku,
      weight,
      length,
      width,
      height,
      detailDescription,
      price,
      category,
      subcategory,
      _attributes,
      stock,
      status,
      discountPercentage,
      artisanName,
      artisanAbout,
    } = req.body;

    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequest(req, res, null, "Invalid product ID");
    }

    // Fetch the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return notFoundRequest(req, res, null, "Product not found");
    }

    // Validate attributes if provided
    const attributes = _attributes
      ? JSON.parse(_attributes)
      : existingProduct.attributes;
    if (_attributes && (!attributes || !Array.isArray(attributes))) {
      return badRequest(req, res, null, "Invalid Attributes");
    }

    // Validate category if provided
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return badRequest(req, res, null, "Invalid category ID");
      }
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return badRequest(req, res, null, "Category not found");
      }
    }

    // Validate subcategory if provided
    if (subcategory) {
      if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return badRequest(req, res, null, "Invalid subcategory ID");
      }
      const existingSubcategory = await SubCategory.findById(subcategory);
      if (!existingSubcategory) {
        return notFoundRequest(req, res, null, "Subcategory not found");
      }
      if (
        !existingSubcategory.parentCategory.equals(
          category || existingProduct.category
        )
      ) {
        return badRequest(
          req,
          res,
          null,
          "Subcategory does not belong to the selected category"
        );
      }
    }

    // Start a transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Handle product images
    const productImages = req.files?.productImage
      ? await Promise.all(
          req.files.productImage.map(async (image) => {
            try {
              const uploadedImage = await uploadImageToCloudinary(
                image,
                "product"
              );
              return uploadedImage?.url || null;
            } catch (error) {
              console.error(
                `Error uploading image: ${image.originalname}`,
                error
              );
              return null;
            }
          })
        ).then((uploadedUrls) => uploadedUrls.filter((url) => url !== null))
      : existingProduct.images; // Retain old images if no new images are uploaded.

    if (productImages.length === 0 && req.files?.productImage) {
      return internalServerError(
        req,
        res,
        null,
        "Failed to upload product images"
      );
    }

    const _detailDescription = JSON.parse(detailDescription);
    // Handle artisan image
    const artisanImage = req.files?.artisanImage
      ? await uploadImageToCloudinary(req.files.artisanImage, "artisan")
      : { url: existingProduct.artisanImage };

    // Prepare updated data
    const updatedData = {
      name: name?.trim() || existingProduct.name,
      detailDescription:
        _detailDescription || existingProduct.detailDescription,
      price: price || existingProduct.price,
      category: category || existingProduct.category,
      subcategory: subcategory || existingProduct.subcategory,
      sku: sku || existingProduct.sku,
      weight: weight || existingProduct.weight,
      length: length || existingProduct.length,
      width: width || existingProduct.width,
      height: height || existingProduct.height,
      attributes: attributes || existingProduct.attributes,
      stock: stock || existingProduct.stock,
      status: status || existingProduct.status,
      discountPercentage:
        discountPercentage || existingProduct.discountPercentage,
      priceAfterDiscount: calculateDiscountedPrice(
        price || existingProduct.price,
        discountPercentage || existingProduct.discountPercentage
      ),
      images: productImages,
      artisanName: artisanName || existingProduct.artisanName,
      artisanAbout: artisanAbout || existingProduct.artisanAbout,
      artisanImage: artisanImage.url,
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      session,
      new: true,
    });

    if (!updatedProduct) {
      return internalServerError(req, res, null, "Failed to update product");
    }

    // Update category references if changed
    if (category && !existingProduct.category.equals(category)) {
      await Category.findByIdAndUpdate(
        existingProduct.category,
        {
          $pull: { products: existingProduct._id },
          $set: { updatedAt: new Date() },
        },
        { session }
      );
      await Category.findByIdAndUpdate(
        category,
        {
          $addToSet: { products: updatedProduct._id },
          $set: { updatedAt: new Date() },
        },
        { session }
      );
    }

    // Update subcategory references if changed
    if (subcategory && !existingProduct.subcategory?.equals(subcategory)) {
      if (existingProduct.subcategory) {
        await SubCategory.findByIdAndUpdate(
          existingProduct.subcategory,
          {
            $pull: { products: existingProduct._id },
            $set: { updatedAt: new Date() },
          },
          { session }
        );
      }
      await SubCategory.findByIdAndUpdate(
        subcategory,
        {
          $addToSet: { products: updatedProduct._id },
          $set: { updatedAt: new Date() },
        },
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    return success(
      req,
      res,
      "Product updated successfully",
      updatedProduct.toObject()
    );
  } catch (error) {
    console.error(error);
    if (session) {
      await session.abortTransaction();
    }
    return internalServerError(req, res, error, "Unable to update product");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!id) {
      return badRequest(req, res, null, "fields are missing");
    }
    // Find the product
    const product = await Product.findById(id);

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return notFoundRequest(req, res, null, "product not found");
    }

    // Remove from category
    await Category.findByIdAndUpdate(
      product.category,
      { $pull: { products: product._id } },
      { session }
    );

    // Remove from subcategory if exists
    if (product.subcategory) {
      await SubCategory.findByIdAndUpdate(
        product.subcategory,
        { $pull: { products: product._id } },
        { session }
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    session.endSession();

    return success(req, res, "product deleted successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return internalServerError(req, res, error, "unable to delete product");
  }
};

// extract the id from image url
const extractId = (url) => {
  const parts = url.split("/");
  const fileWithExt = parts.pop();
  const publicId = fileWithExt.split(".")[0];
  return `${parts.slice(-1)}/${publicId}`;
};

export const deleteSingleImage = async (req, res) => {
  try {
    const { imageUrl, productId } = req.body;

    if (!imageUrl || !productId) {
      return badRequest(req, res, null, "Image ID is required");
    }
    const imageId = extractId(imageUrl);
    if (!imageId) {
      return badRequest(req, res, null, "Invalid image URL format");
    }
    const product = await Product.findById(productId);
    if (!product) {
      return notFoundRequest(req, res, null, "Product not found");
    }
    // if (product.ownerId && product.ownerId.toString() !== req.user.id) {
    //     return badRequest(req, res, null, "You do not have permission to delete this image");
    // }
    if (!product.images.includes(imageUrl)) {
      return badRequest(
        req,
        res,
        null,
        "Image URL does not exist in the product"
      );
    }

    const result = await deleteImageFromCloudinary(imageId);

    if (result?.status !== "success") {
      return notFoundRequest(
        req,
        res,
        null,
        `Failed to delete image: ${result?.reason || "Unknown error"}`
      );
    }

    product.images = product.images.filter((image) => image !== imageUrl);
    await product.save();

    return success(req, res, "Image deleted successfully", {
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Error in deleteSingleImage controller:", error);
    return internalServerError(req, res, error, "Unable to delete image");
  }
};

export const deleteMultipleImages = async (req, res) => {
  try {
    const { imageUrls, productId } = req.body;
    const user = req.user;

    // Validate request body
    if (!productId) {
      return badRequest(req, res, null, "Product ID is required");
    }
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return badRequest(req, res, null, "Image URLs are required");
    }

    // Fetch the product
    const product = await Product.findById(productId);
    if (!product) {
      return notFoundRequest(req, res, null, "Product not found");
    }

    const validImageUrls = imageUrls.filter((url) =>
      product.images.includes(url)
    );

    if (validImageUrls.length === 0) {
      return badRequest(
        req,
        res,
        null,
        "No valid image URLs found in the product"
      );
    }

    // Delete images from Cloudinary
    const results = await Promise.all(
      validImageUrls.map((url) => deleteImageFromCloudinary(extractId(url)))
    );

    // Separate successful and failed deletions
    const successful = results
      .filter((result) => result.status === "success")
      .map((res) => res.imageUrl);
    const failed = results.filter((result) => result.status !== "success");

    // Update product's images array
    if (successful.length > 0) {
      product.images = product.images.filter(
        (image) => !successful.includes(image)
      );
      await product.save();
    }

    return success(req, res, "Images processed successfully", {
      successful,
      failed,
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Error in deleteMultipleImages controller:", error);
    return internalServerError(req, res, error, "Unable to delete images");
  }
};
