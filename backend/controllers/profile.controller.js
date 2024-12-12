import mongoose from "mongoose";
import Profile from "../models/profile.js";
import User from "../models/user.js";
import {
  success,
  badRequest,
  internalServerError,
  notFoundRequest,
} from "../helpers/api-response.js";



export const createProfileForUser = async (user) => {
  try {
      const { _id: userId, fullName, email, phone, accountType, createdAt, updatedAt } = user;

      // Construct profile data
      const profileData = {
          userId,
          profilePicture: "",
          gender: "",
          dateOfBirth: "",
          about: "",
          contactNumber: phone || "",
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

// Update a profile by ID
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid user ID format. Please check your user ID and try again.",
      });
    }

    // Destructure the contact numbers and any other fields from the request body
    const {
      contactNumber,
      alternativeContactNumber,
      hintName,
      location,
      dateOfBirth,
      about,
      ...updates
    } = req.body;

    // Create an object to hold the validated fields
    const updatedProfileFields = { ...updates };

    // Validate contact numbers if provided
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid contact number format. Please enter a valid 10-digit contact number.",
      });
    }

    if (
      alternativeContactNumber &&
      !/^\d{10}$/.test(alternativeContactNumber)
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid alternative contact number format. Please enter a valid 10-digit contact number.",
      });
    }

    // Include validated contact numbers if they are valid
    if (contactNumber) updatedProfileFields.contactNumber = contactNumber;
    if (alternativeContactNumber)
      updatedProfileFields.alternativeContactNumber = alternativeContactNumber;

    // Ensure required fields are present in updates
    if (hintName) updatedProfileFields.hintName = hintName;
    if (location) updatedProfileFields.location = location;
    if (dateOfBirth) updatedProfileFields.dateOfBirth = dateOfBirth;
    if (about) updatedProfileFields.about = about;

    // Find the profile linked to the user
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found. Please check your user details.",
      });
    }

    // Update profile with valid fields
    Object.assign(profile, updatedProfileFields); // Merge updates into the profile document
    await profile.save(); // Save the updated profile

    // Send a clean, user-friendly success response
    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully.",
      data: {
        hintName: profile.hintName,
        location: profile.location,
        dateOfBirth: profile.dateOfBirth,
        about: profile.about,
        contactNumber: profile.contactNumber,
        alternativeContactNumber: profile.alternativeContactNumber,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      status: "error",
      message:
        "An unexpected error occurred while updating your profile. Please try again later.",
    });
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
