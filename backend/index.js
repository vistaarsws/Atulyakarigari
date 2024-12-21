import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

// Import routes
import connectDB from "./config/DBConnection.js";
import cloudinaryConnect from "./config/cloudinary.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import subCategoryRoutes from "./routes/sub-category.routes.js";
import profileRoutes from "./routes/prfile.routes.js";
import ratingAndReviewsRoutes from "./routes/ratingAndReviews.routes.js";
import healthRoutes from "./routes/health.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js"

// Enhanced console styling with emojis and better formatting
const log = {
  info: (msg) => console.log(chalk.blue("ℹ️  INFO     │ ") + chalk.cyan(msg)),
  success: (msg) => console.log(chalk.green("✅ SUCCESS  │ ") + chalk.green(msg)),
  warning: (msg) => console.log(chalk.yellow("⚠️  WARNING  │ ") + chalk.yellow(msg)),
  error: (msg) => console.log(chalk.red("❌ ERROR    │ ") + chalk.red(msg)),
  route: (method, path, status, time) => {
    const statusColor = status >= 500 ? "red" : status >= 400 ? "yellow" : "green";
    const icon = status >= 500 ? "❌" : status >= 400 ? "⚠️" : "✅";
    console.log(
      chalk.magenta("🔗 REQUEST  │ ") +
      chalk.yellow(method.toUpperCase().padEnd(6)) +
      chalk.white(path.padEnd(50)) +
      chalk[statusColor](`${icon} ${status}`) +
      chalk.gray(` (${time}ms)`)
    );
  },
  db: (msg) => console.log(chalk.blue("🗄️  DATABASE      │ ") + chalk.cyan(msg)),
  cloud: (msg) => console.log(chalk.magenta("☁️  CLOUDINARY    │  ") + chalk.magenta(msg))
};

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  maxAge: 3600,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    abortOnLimit: true,
  })
);

// Enhanced request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Override end function to log response details
  const oldEnd = res.end;
  res.end = function () {
    const duration = Date.now() - start;
    log.route(req.method, req.path, res.statusCode, duration);
    return oldEnd.apply(this, arguments);
  };

  next();
});

// Development logging with clean format
if (NODE_ENV === "development") {
  morgan.token('statusColor', (req, res) => {
    const status = res.statusCode;
    return status >= 500 ? chalk.red(status) :
      status >= 400 ? chalk.yellow(status) :
        status >= 300 ? chalk.cyan(status) :
          chalk.green(status);
  });

  app.use(morgan((tokens, req, res) => {
    return false; // Disable default Morgan logging as we have our custom logger
  }));
}

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/sub-category", subCategoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/ratingAndReviews", ratingAndReviewsRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);




// Initialize external services
const initializeServices = async () => {
  try {
    // Start server with enhanced console output
    app.listen(PORT, () => {
      console.log("\n" + chalk.bold.cyan("🚀 SERVER STATUS "));
      console.log(chalk.gray("━".repeat(60)));
      console.log(chalk.white("🌐 PORT        │ ") + chalk.yellow(PORT));
      console.log(chalk.white("🔗 HEALTH CHECK │ ") + chalk.yellow(`http://localhost:${PORT}/api/v1/health`));
      console.log(chalk.gray("━".repeat(60)));
    });

    // Connect to services with clean logging
    await connectDB();
    log.db("Connection established successfully");

    await cloudinaryConnect();
    log.cloud("Connection established successfully");

    console.log(chalk.gray("━".repeat(60)) + "\n");



  } catch (error) {
    log.error("Failed to initialize services:");
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
};

// Enhanced error handlers
process.on("uncaughtException", (err) => {
  log.error("Uncaught Exception! Shutting down...");
  console.error(chalk.red(err.stack));
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  log.error("Unhandled Promise Rejection! Shutting down...");
  console.error(chalk.red(err.stack));
  process.exit(1);
});

initializeServices();

export default app;