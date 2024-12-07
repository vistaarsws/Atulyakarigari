
import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct, getProductById, deleteSingleImage, deleteMultipleImages } from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById)
router.delete("/delete-single-image/", deleteSingleImage)
router.delete("/delete-multiple-images/", deleteMultipleImages)

// router.use(isAdmin)

router.put("/update/:id", updateProduct)
router.post("/create", createProduct);
router.delete("/delete/:id", deleteProduct)





export default router;