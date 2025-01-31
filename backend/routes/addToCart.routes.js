import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/addToCard.controller.js";
import { auth } from "../middlewares/auth.middleware.js"; // Middleware for user authentication

const router = Router();

// Route to add a product to the cart
router.post("/add", auth, addToCart);

// Route to fetch the user's cart
router.get("/get", auth, getCart);

// Route to remove a product from the cart
router.delete("/remove", auth, removeFromCart);

export default router;
