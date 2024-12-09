import { Router } from "express";
import { createSubcategory, deleteSubcategory, getAllSubcategories, getSubcategoryByCategoryId, getSubcategoryById, updateSubcategory } from "../controllers/subCategory.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();


router.get("/get", getAllSubcategories);
router.get("/get/:id", getSubcategoryById)
router.get("/get-by-category/:id", getSubcategoryByCategoryId)

router.use(auth)
router.use(isAdmin)

router.post("/create", createSubcategory);
router.put("/update/:id", updateSubcategory)
router.delete("/delete/:id", deleteSubcategory)




export default router;