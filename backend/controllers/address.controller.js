import mongoose from "mongoose";
import Address from "../models/Address.js";
import {
    success,
    badRequest,
    internalServerError,
    notFoundRequest,
} from "../helpers/api-response.js";

// Create a new address
export const createAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, mobileNumber, pincode, address, locality, city, typeOfAddress, isDefault } = req.body;

        // Validate required fields
        if (!fullName || !mobileNumber || !pincode || !address || !locality || !city || !typeOfAddress) {
            return badRequest(req, res, null, "All fields are required");
        }

        // If default address is set, unset previous default addresses
        if (isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        const newAddress = new Address({
            userId,
            fullName,
            mobileNumber,
            pincode,
            address,
            locality,
            city,
            typeOfAddress,
            isDefault,
        });

        await newAddress.save();
        return success(req, res, "Address created successfully", newAddress.toObject());
    } catch (error) {
        console.error("Error creating address:", error);
        return internalServerError(req, res, error, "Error creating address");
    }
};

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user._id;

        const addresses = await Address.find({ userId });
        if (!addresses || addresses.length === 0) {
            return notFoundRequest(req, res, null, "No addresses found");
        }

        return success(req, res, "Addresses fetched successfully", addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return internalServerError(req, res, error, "Error fetching addresses");
    }
};

// Update an address
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params; // Address ID
        const { isDefault, ...updateData } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return badRequest(req, res, null, "Invalid address ID format");
        }

        // If default address is updated to true, unset previous default addresses
        if (isDefault) {
            await Address.updateMany({ userId }, { isDefault: false });
        }

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, userId },
            { ...updateData, isDefault },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return notFoundRequest(req, res, null, "Address not found");
        }

        return success(req, res, "Address updated successfully", updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        return internalServerError(req, res, error, "Error updating address");
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return badRequest(req, res, null, "Invalid address ID format");
        }

        const address = await Address.findOneAndDelete({ _id: id, userId });

        if (!address) {
            return notFoundRequest(req, res, null, "Address not found");
        }

        return success(req, res, "Address deleted successfully");
    } catch (error) {
        console.error("Error deleting address:", error);
        return internalServerError(req, res, error, "Error deleting address");
    }
};
