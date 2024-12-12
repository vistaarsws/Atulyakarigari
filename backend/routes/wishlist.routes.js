import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { clearWishlist, getWishlist, toggleItemInWishlist } from "../controllers/wishlist.controller.js";
const router = Router();

router.use(auth);

router.get('/get', getWishlist);
router.post('/toggle', toggleItemInWishlist);
router.delete('/clear', clearWishlist);



export default router;