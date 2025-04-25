import express from "express";
import { addAdmin, removeAdmin } from "../controllers/admin.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);
router.use(isAdmin);

router.post("/add-admin", addAdmin);
router.post("/remove-admin", removeAdmin);

export default router;
