import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDB from "./config/DBConnection.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js"
import subCategoryRoutes from "./routes/sub-category.routes.js";
import cloudinaryConnect from "./config/cloudinary.js";
import fileUpload from "express-fileupload";


const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/sub-category", subCategoryRoutes);
app.use("/api/v1/product", productRoutes);


cloudinaryConnect()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
