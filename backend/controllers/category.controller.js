import mongoose from 'mongoose';
import Category from '../models/category.js';
import Product from '../models/product.js';
import SubCategory from '../models/subCategory.js';
import { notFoundRequest, success, internalServerError, badRequest } from '../helpers/api-response.js';

// Category Controllers
export const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const categories = await Category.find()
        // .populate({
        //     path: 'subcategories',
        //     populate: {
        //         path: 'products',
        //         model: 'Product'
        //     }
        // })
        // .populate('products')
        // .skip(skip)
        // .limit(limit);

        const total = await Category.countDocuments();

        // res.status(200).json({
        //     success: true,
        //     count: categories.length,
        //     page,
        //     totalPages: Math.ceil(total / limit),
        //     data: categories
        // });
        return success(req, res, "categories fetched successfully", categories);
    } catch (error) {
        return internalServerError(req, res, error, "unable to Fetch Categories");

    };
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return badRequest(req, res, null, "fields are missing");
        }
        const category = await Category.create({ name });
        console.log(category);

        return success(req, res, "category created successfully", category.toObject());

    } catch (error) {
        if (error.code === 11000) {
            return badRequest(req, res, null, "Category already exists");
        }
        return internalServerError(req, res, error, "unable to Create Category");
    }

};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequest(req, res, null, "invalid id");
        }
        const category = await Category.findById(id)
        // .populate({
        //     path: 'Subcategory',
        //     select: 'name',
        //     populate: {
        //         path: 'products',
        //         model: 'Product'
        //     }
        // })
        // .populate('products');

        if (!category) {
            return notFoundRequest(req, res, null, "Category not found");
        }

        return success(req, res, "category fetched successfully", category.toObject());
    } catch (error) {
        return internalServerError(req, res, error, "unable to Fetch Category");
    }

};

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name || !id) {
            return badRequest(req, res, null, "fields are missing");
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return notFoundRequest(req, res, null, "Category not found");
        }

        return success(req, res, "category updated successfully", category.toObject());
    } catch (error) {
        return internalServerError(req, res, error, "unable to Update Category");
    }

};

export const deleteCategory = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id) || !id) {
            return badRequest(req, res, null, "invalid id");
        }
        // Find the category
        const category = await Category.findById(id);
        console.log(category, "category.................");

        if (!category) {
            return notFoundRequest(req, res, null, "Category Not Found");
        }


        // Remove associated subcategories
        await SubCategory.deleteMany({
            _id: { $in: category.subCategories }
        }, { session });

        // Remove associated products
        await Product.deleteMany({
            _id: { $in: category.products }
        }, { session });

        // Delete the category
        await Category.findByIdAndDelete(req.params.id, { session });

        await session.commitTransaction();
        return success(req, res, "category deleted successfully");
    } catch (error) {
        await session.abortTransaction();
        return internalServerError(req, res, error, "unable to Delete Category");
    } finally {
        session.endSession();
    }
};

