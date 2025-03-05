import SubCategory from "../models/subCategory.js";
import Category from "../models/category.js";
import mongoose from "mongoose";
import { badRequest, internalServerError, notFoundRequest, success } from "../helpers/api-response.js";

// Create subcategory
export const createSubcategory = async (req, res) => {
    let session;
    try {
        const { name, parentCategory } = req.body;

        // Validate input with more detailed checks
        if (!name) {
            return badRequest(req, res, null, "fields are missing");
        }

        if (!parentCategory || !mongoose.Types.ObjectId.isValid(parentCategory)) {
            return badRequest(req, res, null, "invalid parent category");
        }

        // Check if parent category exists
        const existingParentCategory = await Category.findById(parentCategory);
        if (!existingParentCategory) {
            return notFoundRequest(req, res, null, "Parent category not found");
        }

        // Check if subcategory already exists in this parent category
        const existingSubcategory = await SubCategory.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            parentCategory
        });

        if (existingSubcategory) {
            return badRequest(req, res, null, "Subcategory already exists in this parent category");
        }

        // Start mongoose transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // Create subcategory with full object
        const subcategory = await SubCategory.create([{
            name,
            parentCategory
        }], { session });

        // Update parent category to include this subcategory
        const updatedCategory = await Category.findByIdAndUpdate(
            parentCategory,
            { $addToSet: { subcategory: subcategory[0]._id } },
            { session, new: true }
        );

        // Verify category was updated
        if (!updatedCategory) {
            throw new Error('Failed to update parent category');
        }

        // Commit transaction
        await session.commitTransaction();
        console.log(subcategory, "subcategory");
        const subcategoryData = subcategory[0].toObject();
        // Respond with created subcategory
        return success(req, res, "Subcategory created successfully", subcategoryData);

    } catch (error) {
        console.log(error);
        // Abort transaction
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        if (error.code === 11000) {
            return badRequest(req, res, null, "Sub Category already exists");
        }
        return internalServerError(req, res, error, "Unable To Create Subcategory");
    } finally {
        // Ensure session is ended
        if (session) {
            session.endSession();
        }
    }
};

// Get all subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        // Destructure query parameters with defaults
        const {
            page = 1,
            limit = 10,
            search = '',
            parentCategory
        } = req.query;

        // Convert to numbers and ensure valid values
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));

        // Build search query
        const searchQuery = {};

        // Add name search if provided
        if (search) {
            searchQuery.name = { $regex: search, $options: 'i' };
        }

        // Add parent category filter if provided
        if (parentCategory && mongoose.Types.ObjectId.isValid(parentCategory)) {
            searchQuery.parentCategory = parentCategory;
        }

        // Calculate skip value for pagination
        const skipValue = (pageNumber - 1) * limitNumber;

        // Fetch total count for pagination
        const totalCount = await SubCategory.countDocuments(searchQuery);

        // Fetch subcategories with pagination
        const subcategories = await SubCategory.find(searchQuery)
            // .populate('parentCategory')
            .sort({ createdAt: -1 })
            .skip(skipValue)
            .limit(limitNumber)
            .select("_id name");

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNumber);

        return success(req, res, "Subcategories retrieved successfully", {
            subcategories,
            pagination: {
                totalDocs: totalCount,
                totalPages: totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        })
    } catch (error) {
        console.error('Get subcategories error:', error);
        return internalServerError(req, res, error, "Failed to retrieve subcategories");
    }
};

// Get subcategory by subcategory ID
export const getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            badRequest(req, res, null, "Invalid Category ID");
        }

        // Find subcategory with populated parent category
        const subcategory = await SubCategory.findById(id).populate('parentCategory').populate('products')

        // Check if subcategory exists
        if (!subcategory) {
            return notFoundRequest(req, res, null, "Subcategory not found");
        }

        return success(req, res, "Subcategory retrieved successfully", subcategory.toObject());
    } catch (error) {
        return internalServerError(req, res, error, "Failed to retrieve subcategory");
    }
};

// Get subcategory by category ID
export const getSubcategoryByCategoryId = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            badRequest(req, res, null, "Invalid Category ID");
        }

        // Find subcategory with populated parent category
        const subcategory = await Category.findById(id).select('_id name subcategory').populate({
            path: 'subcategory', select: 'name _id'
        });

        // Check if subcategory exists
        if (!subcategory) {
            return notFoundRequest(req, res, null, "Subcategory not found");
        }

        return success(req, res, "Subcategory retrieved successfully", subcategory.toObject());
    } catch (error) {
        console.log(error);
        return internalServerError(req, res, error, "Failed to retrieve subcategory");
    }
};

// Update subcategory
export const updateSubcategory = async (req, res) => {
    let session;
    try {
        const { id } = req.params;
        const { name, parentCategory } = req.body;

        // Validate input
        if (!name || !id) {
            return badRequest(req, res, null, "fields are missing");
        }

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequest(req, res, null, "invalid id");
        }

        // Optional: Validate parent category if provided
        if (parentCategory && !mongoose.Types.ObjectId.isValid(parentCategory)) {
            return badRequest(req, res, null, "invalid parent category");
        }

        // Start transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // Find existing subcategory
        const existingSubcategory = await SubCategory.findById(id);
        if (!existingSubcategory) {
            return notFoundRequest(req, res, null, "subcategory not found");
        }

        // Check for duplicate name in the same parent category
        const duplicateCheck = await SubCategory.findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            parentCategory: parentCategory || existingSubcategory.parentCategory
        });

        if (duplicateCheck) {
            return badRequest(req, res, null, "duplicate name in the same parent category");
        }

        // Prepare update data
        const updateData = {
            name: name.trim(),
            ...(parentCategory && { parentCategory })
        };

        // Update subcategory
        const updatedSubcategory = await SubCategory.findByIdAndUpdate(
            id,
            updateData,
            { session, new: true, runValidators: true }
        );

        // If parent category changed, update category references
        if (parentCategory && parentCategory !== existingSubcategory.parentCategory) {
            // Remove from old parent category
            await Category.findByIdAndUpdate(
                existingSubcategory.parentCategory,
                { $pull: { subcategories: id } },
                { session }
            );

            // Add to new parent category
            await Category.findByIdAndUpdate(
                parentCategory,
                { $addToSet: { subcategories: id } },
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();
        return success(req, res, "Sub Category Updated Successfully", updatedSubcategory.toObject());
    } catch (error) {
        // Abort transaction if it exists
        if (session && session.inTransaction()) {
            await session.abortTransaction();
        }
        return internalServerError(req, res, error, "unable to Update Sub Category");
    } finally {
        // Ensure session is ended
        if (session) {
            session.endSession();
        }
    }
};

// Delete subcategory
export const deleteSubcategory = async (req, res) => {
    let session;
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            badRequest(req, res, null, "invalid id");
        }

        // Start transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // Find existing subcategory
        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
            return notFoundRequest(req, res, null, "Subcategory not found");
        }

        // Remove subcategory
        await SubCategory.findByIdAndDelete(id, { session });

        // Remove reference from parent category
        await Category.findByIdAndUpdate(
            subcategory.parentCategory,
            { $pull: { subcategory: id } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();

        return success(req, res, "Sub Category Deleted Successfully",);
    } catch (error) {
        // Abort transaction if it exists
        if (session) {
            await session.abortTransaction();
        }
        return internalServerError(req, res, error, "unable to Delete Sub Category");
    } finally {
        // Ensure session is ended
        if (session) {
            session.endSession();
        }
    }
};