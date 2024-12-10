import Profile from "../models/profile.js";
import User from "../models/user.js";
import { success, badRequest, internalServerError, notFoundRequest } from "../helpers/api-response.js";

// Create a new profile
export const createProfile = async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;

        // Ensure user exists
        if (!mongoose.isValidObjectId(userId)) {
            return badRequest(req, res, null, "Invalid user ID format");
        }

        const user = await User.findById(userId);
        if (!user) {
            return notFoundRequest(req, res, null, "User not found");
        }

        // Create and save the profile
        const newProfile = new Profile({ ...profileData, userId });
        await newProfile.save();

        // Link the profile to the user
        user.additionalDetails = newProfile._id;
        await user.save();

        return success(req, res, "Profile created successfully", { data: newProfile });
    } catch (error) {
        return internalServerError(req, res, error, "Error creating profile");
    }
};

// Fetch all profiles
export const getAllProfiles = async (req, res) => {
    try {
        // Fetch all profiles and populate user details
        const profiles = await Profile.find().populate("userId", "fullName email");

        if (!profiles || profiles.length === 0) {
            return notFoundRequest(req, res, null, "No profiles found");
        }

        return success(req, res, "Profiles fetched successfully", { data: profiles });
    } catch (error) {
        return internalServerError(req, res, error, "Error fetching profiles");
    }
};

// Fetch profile by ID
export const getProfileById = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(userId)) {
            return badRequest(req, res, null, "Invalid profile ID format");
        }

        // Fetch the profile and populate user details
        const profile = await Profile.findById(userId).populate("userId", "fullName email");

        if (!profile) {
            return notFoundRequest(req, res, null, "Profile not found");
        }

        return success(req, res, "Profile fetched successfully", { data: profile });
    } catch (error) {
        return internalServerError(req, res, error, "Error fetching profile");
    }
};

// Update a profile by ID
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        if (!mongoose.isValidObjectId(userId)) {
            return badRequest(req, res, null, "Invalid profile ID format");
        }

        // Update the profile
        const updatedProfile = await Profile.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });
        if (!updatedProfile) {
            return notFoundRequest(req, res, null, "Profile not found");
        }

        return success(req, res, "Profile updated successfully", { data: updatedProfile });
    } catch (error) {
        return internalServerError(req, res, error, "Error updating profile");
    }
};

// Delete a profile by ID
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(userId)) {
            return badRequest(req, res, null, "Invalid profile ID format");
        }

        // Delete the profile and unlink it from the user
        const profile = await Profile.findById(userId);
        if (!profile) {
            return notFoundRequest(req, res, null, "Profile not found");
        }

        // Unlink the profile from the user
        await User.findByIdAndUpdate(profile.userId, { $unset: { additionalDetails: "" } });

        await profile.remove();
        return success(req, res, "Profile deleted successfully");
    } catch (error) {
        return internalServerError(req, res, error, "Error deleting profile");
    }
};
