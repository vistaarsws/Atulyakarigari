
import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct, getProductById } from "../controllers/product.controller.js";
const router = Router();

router.post("/create", createProduct);
router.get("/get", getAllProducts);
router.get("/get/:id", getProductById)
router.put("/update/:id", updateProduct)
router.delete("/delete/:id", deleteProduct)




export default router;