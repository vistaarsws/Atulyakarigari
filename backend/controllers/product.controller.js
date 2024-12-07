import Product from "../models/product.js";
import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import mongoose from "mongoose";
import { badRequest, internalServerError, notFoundRequest, success } from "../helpers/api-response.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/image-uploder/index.js";


export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.subcategory) filter.subcategory = req.query.subcategory;
        if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
        if (req.query.maxPrice) filter.price = {
            ...filter.price,
            $lte: parseFloat(req.query.maxPrice)
        };

        const products = await Product.find(filter)
        // .populate('category')
        // .populate('subcategory')
        // .skip(skip)
        // .limit(limit);

        const total = await Product.countDocuments(filter);
        return success(req, res, "products fetched successfully", {
            count: products.length,
            page,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        return internalServerError(req, res, error, "unable to get products");
    }

};

export const createProduct = async (req, res) => {
    let session;
    try {
        // Destructure and validate input
        const {
            name,
            description,
            price,
            category,
            subcategory,
            _attributes,
            stock,
            status,
            priceAfterDiscount,
            artisanName,
            artisanAbout,
        } = req.body;

        if (!req.files || !req.files.productImage) {
            return badRequest(req, res, null, "product image is required");
        }
        if (!req.files.artisanImage) {
            return badRequest(req, res, null, "artisan image is required");
        }
        //  input validation
        if (!name || !price || !category || !stock || !status || !description || !_attributes || !priceAfterDiscount || !artisanName || !artisanAbout) {
            return badRequest(req, res, null, "fields are missing");
        }
        const attributes = JSON.parse(_attributes);
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
                return badRequest(req, res, null, "subcategory does not belong to the selected category");
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
        const validUrls = uploadedUrls.filter(url => url !== null);

        // If no images were successfully uploaded, return an error
        if (validUrls.length === 0) {
            return internalServerError(req, res, null, "Failed to upload product images");
        }

        productImages.push(...validUrls);
        // artisan Image upload
        const artisanPicture = await uploadImageToCloudinary(req.files.artisanImage, "artisan");
        //  product data
        const productData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            price,
            category,
            subcategory: subcategory || null,
            attributes,
            stock,
            status,
            priceAfterDiscount,
            images: productImages,
            artisanName,
            artisanAbout,
            artisanImage: artisanPicture.url
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
                $set: { updatedAt: new Date() }
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
                    $set: { updatedAt: new Date() }
                },
                { session, new: true }
            );
        }

        // Commit transaction
        await session.commitTransaction();;
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
        if (!id) {
            return badRequest(req, res, null, "fields are missing");
        }
        const product = await Product.findById(id)
            .populate('category', "name")
            .populate({
                path: 'subcategory',
                model: 'SubCategory',
                options: { strictPopulate: false },
                select: 'name'
            });

        if (!product) {
            return notFoundRequest(req, res, null, "product not found");
        }

        return success(req, res, "product fetched successfully", product);
    } catch (error) {
        return internalServerError(req, res, error, "unable to get product");
    }

};

// export const updateProduct = async (req, res) => {


//     try {
//         const { id } = req.params;
//         if (!id) {
//             return badRequest(req, res, null, "fields are missing");
//         }
//         const currentProduct = await Product.findById(id);

//         if (!currentProduct) {
//             return notFoundRequest(req, res, null, "product not found");
//         }
//         const session = await mongoose.startSession();
//         session.startTransaction();
//         // Update product
//         const product = await Product.findByIdAndUpdate(
//             id,
//             req.body,
//             {
//                 new: true,
//                 runValidators: true,
//                 session
//             }
//         );

//         // Handle category updates
//         if (req.body.category &&
//             req.body.category.toString() !== currentProduct.category.toString()) {
//             // Remove from old category
//             await Category.findByIdAndUpdate(
//                 currentProduct.category,
//                 { $pull: { products: currentProduct._id } },
//                 { session }
//             );

//             // Add to new category
//             await Category.findByIdAndUpdate(
//                 req.body.category,
//                 { $addToSet: { products: product._id } },
//                 { session }
//             );
//         }

//         // Handle subcategory updates
//         if (req.body.subcategory &&
//             (!currentProduct.subcategory ||
//                 req.body.subcategory.toString() !== currentProduct.subcategory.toString())) {
//             // Remove from old subcategory if exists
//             if (currentProduct.subcategory) {
//                 await Subcategory.findByIdAndUpdate(
//                     currentProduct.subcategory,
//                     { $pull: { products: currentProduct._id } },
//                     { session }
//                 );
//             }

//             // Add to new subcategory
//             await SubCategory.findByIdAndUpdate(
//                 req.body.subcategory,
//                 { $addToSet: { products: product._id } },
//                 { session }
//             );
//         }
//         await session.commitTransaction();
//         session.endSession();
//         return success(req, res, "product updated successfully", product.toObject());
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         return internalServerError(req, res, error, "unable to update product");
//     }
// };
export const updateProduct = async (req, res) => {
    let session;
    try {
        const {
            name,
            description,
            price,
            category,
            subcategory,
            _attributes,
            stock,
            status,
            priceAfterDiscount,
            artisanName,
            artisanAbout,
        } = req.body;

        const { id } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequest(req, res, null, "Invalid product ID");
        }

        // Fetch the product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return notFoundRequest(req, res, null, "Product not found");
        }

        // Optional: Validate attributes
        const attributes = _attributes ? JSON.parse(_attributes) : existingProduct.attributes;
        if (_attributes && (!attributes || !Array.isArray(attributes))) {
            return badRequest(req, res, null, "Invalid Attributes");
        }

        // Check if category exists
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            return badRequest(req, res, null, "Invalid category ID");
        }

        const existingCategory = category ? await Category.findById(category) : null;
        if (category && !existingCategory) {
            return badRequest(req, res, null, "Category not found");
        }

        // Optional: Validate subcategory
        if (subcategory) {
            if (!mongoose.Types.ObjectId.isValid(subcategory)) {
                return badRequest(req, res, null, "Invalid subcategory ID");
            }

            const existingSubcategory = await SubCategory.findById(subcategory);
            if (!existingSubcategory) {
                return notFoundRequest(req, res, null, "Subcategory not found");
            }

            if (!existingSubcategory.parentCategory.equals(category || existingProduct.category)) {
                return badRequest(req, res, null, "Subcategory does not belong to the selected category");
            }
        }

        // Start mongoose transaction
        session = await mongoose.startSession();
        session.startTransaction();

        const productImages = [...existingProduct.images];
        if (req.files && req.files.productImage) {
            const imagePromises = req.files.productImage.map(async (image) => {
                try {
                    const uploadedImage = await uploadImageToCloudinary(image, "product");
                    if (uploadedImage && uploadedImage.url) {
                        return uploadedImage.url;
                    }
                } catch (error) {
                    console.error(`Error uploading image: ${image.originalname}`, error);
                    return null;
                }
            });

            const uploadedUrls = await Promise.all(imagePromises);
            const validUrls = uploadedUrls.filter(url => url !== null);
            if (validUrls.length === 0 && req.files.productImage.length > 0) {
                return internalServerError(req, res, null, "Failed to upload product images");
            }
            productImages.push(...validUrls);
        }

        // Artisan image upload
        const artisanPicture = req.files && req.files.artisanImage
            ? await uploadImageToCloudinary(req.files.artisanImage, "artisan")
            : { url: existingProduct.artisanImage };

        // Update product data
        const updatedData = {
            name: name?.trim() || existingProduct.name,
            description: description?.trim() || existingProduct.description,
            price: price || existingProduct.price,
            category: category || existingProduct.category,
            subcategory: subcategory || existingProduct.subcategory,
            attributes: attributes || existingProduct.attributes,
            stock: stock || existingProduct.stock,
            status: status || existingProduct.status,
            priceAfterDiscount: priceAfterDiscount || existingProduct.priceAfterDiscount,
            images: productImages,
            artisanName: artisanName || existingProduct.artisanName,
            artisanAbout: artisanAbout || existingProduct.artisanAbout,
            artisanImage: artisanPicture.url,
        };

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedData,
            { session, new: true }
        );

        if (!updatedProduct) {
            return internalServerError(req, res, null, "Failed to update product");
        }

        // Update category references if category was changed
        if (category && !existingProduct.category.equals(category)) {
            await Category.findByIdAndUpdate(
                existingProduct.category,
                { $pull: { products: existingProduct._id }, $set: { updatedAt: new Date() } },
                { session }
            );

            await Category.findByIdAndUpdate(
                category,
                { $addToSet: { products: updatedProduct._id }, $set: { updatedAt: new Date() } },
                { session }
            );
        }

        // Update subcategory references if subcategory was changed
        if (subcategory && !existingProduct.subcategory?.equals(subcategory)) {
            if (existingProduct.subcategory) {
                await SubCategory.findByIdAndUpdate(
                    existingProduct.subcategory,
                    { $pull: { products: existingProduct._id }, $set: { updatedAt: new Date() } },
                    { session }
                );
            }

            await SubCategory.findByIdAndUpdate(
                subcategory,
                { $addToSet: { products: updatedProduct._id }, $set: { updatedAt: new Date() } },
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();

        return success(req, res, "Product updated successfully", updatedProduct.toObject());
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

// cloudinary image delete
export const deleteSingleImage = async (req, res) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return badRequest(req, res, null, "Image ID is required");
        }

        const result = await deleteImageFromCloudinary(imageId);

        if (result.status === "success") {
            return success(req, res, "Image deleted successfully", result);
        } else {
            return notFoundRequest(req, res, null, `Failed to delete image: ${result.reason}`);
        }
    } catch (error) {
        console.error("Error in deleteSingleImage controller:", error);
        return internalServerError(req, res, error, "Unable to delete image");
    }
};

export const deleteMultipleImages = async (req, res) => {
    try {
        const { imageIds } = req.body;

        if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
            return badRequest(req, res, null, "Image IDs are required");
        }

        //  utility function for each image
        const results = await Promise.all(imageIds.map(id => deleteImageFromCloudinary(id)));

        // Separate successful and failed deletions
        const successful = results.filter(result => result.status === "success");
        const failed = results.filter(result => result.status !== "success");

        return success(req, res, "images deleted successfully", {
            successful,
            failed,
        });
    } catch (error) {
        console.error("Error in deleteMultipleImages controller:", error);
        return internalServerError(req, res, error, "Unable to delete images");
    }
};
