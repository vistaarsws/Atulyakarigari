import { Router } from "express";
import { createSubcategory, deleteSubcategory, getAllSubcategories, getSubcategoryByCategoryId, getSubcategoryById, updateSubcategory } from "../controllers/subCategory.controller.js";
const router = Router();

router.post("/create", createSubcategory);
router.get("/get", getAllSubcategories);
router.get("/get/:id", getSubcategoryById)
router.get("/get-by-category/:id", getSubcategoryByCategoryId)
router.put("/update/:id", updateSubcategory)
router.delete("/delete/:id", deleteSubcategory)




export default router;