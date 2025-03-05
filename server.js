const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { createServer } = require("http");
const { initializeSocket } = require("./socket"); // Import WebSocket logic

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express App
const app = express();
const httpServer = createServer(app); // Create an HTTP server

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/post", require("./routes/postRoutes"));

// Initialize WebSocket
initializeSocket(httpServer);

// Port
const PORT = process.env.PORT || 8080;

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.bgGreen.white);
});
