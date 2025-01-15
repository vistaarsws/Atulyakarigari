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
const formatCart = (cart) => ({
    userId: cart.userId,
    items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        _id: item._id,
    })),
    total: cart.total,
    _id: cart._id,
});

// Add or update item in the cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; // Assuming user ID is in the token

        if (!productId || !quantity || quantity < 1) {
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
            cart = new Cart({ userId, items: [], total: 0 });
        }

        // Check if the product is already in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Update quantity if the product exists in the cart
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ productId, quantity });
        }

        // Recalculate the total
        cart.total = await calculateCartTotal(cart.items);

        // Save the cart
        await cart.save();

        // Return success response
        successResponse(res, formatCart(cart), "Product successfully added to cart.");
    } catch (error) {
        console.error("Error in addToCart:", error);
        return internalServerError(req, res, error, "Unable to add product to cart");
    }
};

// Get the cart for the user
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId }).populate("items.productId", "name price images");
        if (!cart) {
            return notFoundRequest(req, res, null, "Cart not found");
        }

        // Return success response
        successResponse(res, formatCart(cart), "Cart retrieved successfully.");
    } catch (error) {
        console.error("Error in getCart:", error);
        return internalServerError(req, res, error, "Unable to fetch cart");
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        if (!productId) {
            return badRequest(req, res, null, "Product ID is required");
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return notFoundRequest(req, res, null, "Cart not found");
        }

        // Remove the product from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Recalculate the total
        cart.total = await calculateCartTotal(cart.items);

        // If there are no items left in the cart, delete the cart
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            return successResponse(res, null, "Cart is empty and has been deleted.");
        }

        // Save the cart if it still has items
        await cart.save();

        // Return success response
        successResponse(res, formatCart(cart), "Product successfully removed from cart.");
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return internalServerError(req, res, error, "Unable to remove product from cart");
    }
};


// Helper function to calculate total
const calculateCartTotal = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};
