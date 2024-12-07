import Product from "../models/product.js";
import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import mongoose from "mongoose";
import { badRequest, internalServerError, notFoundRequest, success } from "../helpers/api-response.js";


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
            attributes,
            stock,
            status
        } = req.body;
        console.log(req.files);

        if (!req.files || !req.files.productImage) {
            return badRequest(req, res, null, "product image is required");
        }        //  input validation
        if (!name || !price || !category || !stock) {
            return badRequest(req, res, null, "fields are missing");
        }
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

        // Prepare product data
        const productData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            price,
            category,
            subcategory: subcategory || null,
            attributes,
            stock,
            status
        };

        // Create product
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

export const updateProduct = async (req, res) => {


    try {
        const { id } = req.params;
        if (!id) {
            return badRequest(req, res, null, "fields are missing");
        }
        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            return notFoundRequest(req, res, null, "product not found");
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        // Update product
        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
                session
            }
        );

        // Handle category updates
        if (req.body.category &&
            req.body.category.toString() !== currentProduct.category.toString()) {
            // Remove from old category
            await Category.findByIdAndUpdate(
                currentProduct.category,
                { $pull: { products: currentProduct._id } },
                { session }
            );

            // Add to new category
            await Category.findByIdAndUpdate(
                req.body.category,
                { $addToSet: { products: product._id } },
                { session }
            );
        }

        // Handle subcategory updates
        if (req.body.subcategory &&
            (!currentProduct.subcategory ||
                req.body.subcategory.toString() !== currentProduct.subcategory.toString())) {
            // Remove from old subcategory if exists
            if (currentProduct.subcategory) {
                await Subcategory.findByIdAndUpdate(
                    currentProduct.subcategory,
                    { $pull: { products: currentProduct._id } },
                    { session }
                );
            }

            // Add to new subcategory
            await SubCategory.findByIdAndUpdate(
                req.body.subcategory,
                { $addToSet: { products: product._id } },
                { session }
            );
        }
        await session.commitTransaction();
        session.endSession();
        return success(req, res, "product updated successfully", product);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return internalServerError(req, res, error, "unable to update product");
    }
};

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