import mongoose, { mongo } from "mongoose";
import {
  badRequest,
  internalServerError,
  notFoundRequest,
  success,
} from "../helpers/api-response.js";
import Wishlist from "../models/wishlist.js";

// Get Wishlist
export const getWishlist = async (req, res) => {
  const { _id } = req.user;
  try {
    const wishlist = await Wishlist.find({ userId: _id }).populate("items");

    if (!wishlist) {
      return notFoundRequest(req, res, null, "Wishlist not found");
    }
    return success(req, res, "Wishlist retrieved successfully", { wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return internalServerError(req, res, error, "Failed to retrieve wishlist");
  }
};

// Toggle Item in Wishlist
export const toggleItemInWishlist = async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return badRequest(req, res, null, "Invalid Product ID");
  }

  try {
    let wishlist = await Wishlist.findOne({ userId: _id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: _id, items: [productId] });
      await wishlist.save();
      return success(
        req,
        res,
        "Product added to wishlist",
        wishlist.toObject()
      );
    }

    if (!Array.isArray(wishlist.items)) {
      wishlist.items = [];
    }

    const productIndex = wishlist.items.findIndex(
      (item) => item?.toString() === productId
    );

    if (productIndex !== -1) {
      wishlist.items.splice(productIndex, 1);
      await wishlist.save();
      return success(
        req,
        res,
        "Product removed from wishlist",
        wishlist.toObject()
      );
    }

    wishlist.items.push(productId);
    await wishlist.save();
    return success(req, res, "Product added to wishlist", wishlist.toObject());
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
