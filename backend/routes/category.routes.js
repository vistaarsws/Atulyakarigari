import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, deleteCategory, updateCategory } from "../controllers/category.controller.js";
const router = Router();

router.post("/create", createCategory);
router.get("/get", getAllCategories);
router.get("/get/:id", getCategoryById)
router.put("/update/:id", updateCategory)
router.delete("/delete/:id", deleteCategory)




export default router;