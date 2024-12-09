
import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct, getProductById, deleteSingleImage, deleteMultipleImages } from "../controllers/product.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById)

// router.use(isAdmin)
// router.use(auth)

router.delete("/delete-single-image/", deleteSingleImage)
router.delete("/delete-multiple-images/", deleteMultipleImages)
router.put("/update/:id", updateProduct)
router.post("/create", createProduct);
router.delete("/delete/:id", deleteProduct)





export default router;