import mongoose from "mongoose";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import {
  success,
  badRequest,
  internalServerError,
  notFoundRequest,
} from "../helpers/api-response.js";
import { uploadImageToCloudinary } from "../utils/image-uploder/index.js";



export const createProfileForUser = async (user, fullName, isEmailLogin, loginId) => {
  try {
    const email = isEmailLogin ? loginId : "";
    const phone = isEmailLogin ? "" : loginId;
    // Construct profile data
    const profileData = {
      userId: user._id,
      fullName,
      email: email || "",
      contactNumber: phone || "",
      profilePicture: "",
      gender: "",
      dateOfBirth: "",
      about: "",
      alternativeContactNumber: "",
      hintName: "",
      location: "",
    };

    // Create and save the profile
    const newProfile = new Profile(profileData);
    await newProfile.save();

    // Link the profile to the user
    user.additionalDetails = newProfile._id;
    await user.save();

    return newProfile;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw new Error("Error creating profile");
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      email,
      fullName,
      gender,
      dateOfBirth,
      about,
      contactNumber,
      alternativeContactNumber,
      hintName,
      location
    } = req.body;
    const { profileImage } = req.files

    // Validate input fields
    const validationErrors = {};

    // Email validation (optional, but with basic format check)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = 'Invalid email format';
    }

    // Contact number validation (optional)
    if (contactNumber && isNaN(contactNumber)) {
      validationErrors.contactNumber = 'Contact number must be a valid number';
    }

    if (alternativeContactNumber && isNaN(alternativeContactNumber)) {
      validationErrors.alternativeContactNumber = 'Alternative contact number must be a valid number';
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return badRequest(req, res, validationErrors, 'Validation Error');
    }
    // upload profile image
    let profilePicture
    if (profileImage) {
      profilePicture = await uploadImageToCloudinary(profileImage, "profile")
    }
    const updateData = {};

    if (email) updateData.email = email;
    if (fullName) updateData.fullName = fullName;
    if (profilePicture) updateData.profilePicture = profilePicture.secure_url;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (about) updateData.about = about;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (alternativeContactNumber) updateData.alternativeContactNumber = alternativeContactNumber;
    if (hintName) updateData.hintName = hintName;
    if (location) updateData.location = location;
    // Find and update profile
    const profile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      {
        new: true,  // Return the updated document
        runValidators: true  // Run mongoose validation
      }
    );
    return success(req, res, 'Profile updated successfully', { profile });
  } catch (error) {
    console.error('Profile update error:', error);

    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return internalServerError(req, res, validationErrors, 'Validation Error');
    }
    // Handle duplicate key errors
    if (error.code === 11000) {
      return internalServerError(req, res, error, 'Duplicate key error');
    }

    return internalServerError(req, res, error, 'Internal server error');
  }
};

// Delete a profile by ID
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user?._id; // Extract user ID from request

    if (!mongoose.isValidObjectId(userId)) {
      return badRequest(req, res, null, "Invalid user ID format");
    }

    // Find the profile linked to the user
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return notFoundRequest(req, res, null, "Profile not found");
    }

    // Unlink the profile from the user
    await User.findByIdAndUpdate(userId, { $unset: { additionalDetails: "" } });

    // Remove the profile
    await profile.remove();

    return success(req, res, "Profile deleted successfully");
  } catch (error) {
    console.error("Error deleting profile:", error);
    return internalServerError(req, res, error, "Error deleting profile");
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id;// Extract user ID from request

    if (!mongoose.isValidObjectId(userId)) {
      return badRequest(req, res, null, "Invalid user ID format");
    }

    // Find the profile linked to the user
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return notFoundRequest(req, res, null, "Profile not found");
    }

    // Send a clean, user-friendly success response
    return success(req, res, "Profile fetched successfully", profile.toObject());
  } catch (error) {
    console.error("Error fetching profile:", error);
    return internalServerError(req, res, error, "Error fetching profile");
  }
};
