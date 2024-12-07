import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, deleteCategory, updateCategory } from "../controllers/category.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get", getAllCategories);
router.get("/get/:id", getCategoryById)

// router.use(isAdmin)

router.post("/create", createCategory);
router.put("/update/:id", updateCategory)
router.delete("/delete/:id", deleteCategory)




export default router;