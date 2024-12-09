import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDB from "./config/DBConnection.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js"
import subCategoryRoutes from "./routes/sub-category.routes.js";
import profileRoutes from "./routes/prfile.routes.js";
import reviewRoutes from "./routes/review.routes.js";
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
app.use("/api/v1/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes); 

// Protected route example
app.get('/api/v1/protected',async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { verifyToken } = await import('./utils/google-auth/googleAuth.js');
    const userData = verifyToken(token);
    res.json({ message: 'Protected content', user: userData });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
cloudinaryConnect()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
