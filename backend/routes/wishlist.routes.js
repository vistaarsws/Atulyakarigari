import { Router } from "express";
import { auth, isUser } from "../middlewares/auth.middleware.js";
import { getWishlist, toggleItemInWishlist } from "../controllers/wishlist.controller.js";
const router = Router();

router.use(auth);

router.get('/get', getWishlist);
router.post('/toggle', toggleItemInWishlist);



export default router;