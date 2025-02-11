import Cart from "../models/addToCart.js";
import Product from "../models/product.js";
import { badRequest, internalServerError, notFoundRequest } from "../helpers/api-response.js";

// Centralized success response function
const successResponse = (res, data, message) => {
    res.status(200).json({
        data,
        message,
        error: false,
        success: true,
    });
};

// Helper function to format the cart data
const formatCart = (cart,total) => ({
    userId: cart.userId,
    items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        description: item.productId.description,
        price: item.productId.price,
        priceAfterDiscount: item.productId.priceAfterDiscount,
        images: item.productId.images,
        name: item.productId.name,
        _id: item._id,
    })),
    total: total.total, // Total after discounts
    totalMRP: total.totalMRP, // Total original price
    totalDiscount: total.totalDiscount, // Total discount
    _id: cart._id,
});

// Add or update item in the cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body; // Default quantity to 1
        const userId = req.user._id; // Assuming user ID is available in the token

        if (!productId || quantity < 1) {
            return badRequest(req, res, null, "Invalid product ID or quantity");
        }

        // Validate the product
        const product = await Product.findById(productId);
        if (!product) {
            return notFoundRequest(req, res, null, "Product not found");
        }
        if (product.stock < quantity) {
            return badRequest(req, res, null, "Insufficient stock");
        }

        // Find or create the cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0, totalMRP: 0, totalDiscount: 0 });
        }

        // Check if the product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Replace the quantity if the product exists in the cart
            cart.items[itemIndex].quantity = quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ productId, quantity });
        }

        // Recalculate the totals
        const { total, totalMRP, totalDiscount } = await calculateCartTotal(cart.items);
        cart.total = total;
        cart.totalMRP = totalMRP;
        cart.totalDiscount = totalDiscount;

        // Save the cart
        await cart.save();

        // Return success response
        successResponse(res, formatCart(cart,total), "Product successfully added or updated in the cart.");
    } catch (error) {
        console.error("Error in addToCart:", error);
        return internalServerError(req, res, error, "Unable to add or update product in cart");
    }
};

// Get the cart for the user
export const getCart = async (req, res) => {
  try {
    //updated by mohit 
    const userId = req.user?._id;
    if (!userId) {
      return notFoundRequest(req, res, null, "User not authenticated");
    }

        // Fetch the user's cart and populate product details
        const cart = await Cart.findOne({ userId }).populate("items.productId", "name price description priceAfterDiscount images");
        if (!cart) {
            return notFoundRequest(req, res, null, "Cart not found");
        }

        // Calculate totals
        const totals = await calculateCartTotal(cart.items);

        // Return formatted cart data with totals
        successResponse(res, formatCart(cart, totals), "Cart retrieved successfully.");
    } catch (error) {
        console.error("Error in getCart:", error);
        return internalServerError(req, res, error, "Unable to fetch cart");
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id; // Assuming user ID is in the token

        // Validate request
        if (!productId) {
            return badRequest(req, res, null, "Product ID is required");
        }

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return notFoundRequest(req, res, null, "Cart not found");
        }

        // Find the index of the product in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return notFoundRequest(req, res, null, "Product not found in the cart");
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Recalculate the total
        const totals = await calculateCartTotal(cart.items);
        cart.total = totals.total;

        // If there are no items left in the cart, delete the cart
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            return successResponse(res, null, "Cart is empty and has been deleted.");
        }

        // Save the updated cart
        await cart.save();

        // Return success response
        successResponse(res, formatCart(cart, totals), "Product successfully removed from cart.");
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return internalServerError(req, res, error, "Unable to remove product from cart");
    }
};


// Helper function to calculate totals
const calculateCartTotal = async (items) => {
    let total = 0; // Total price after discounts
    let totalMRP = 0; // Total original price without discounts
    let totalDiscount = 0; // Total discount amount

    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            const priceAfterDiscount = product.priceAfterDiscount || product.price;
            total += priceAfterDiscount * item.quantity;
            totalMRP += product.price * item.quantity;
            totalDiscount += (product.price - priceAfterDiscount) * item.quantity;
        }
    }

    return { total, totalMRP, totalDiscount };
};
