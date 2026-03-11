require('dotenv').config({ override: true });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Connect to database
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const path = require("path");

// Routes imports
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const transportRoutes = require("./routes/transportRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const guideRoutes = require("./routes/guideRoutes");

// Serve statically uploaded images
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/guides", guideRoutes);

// Base route test
app.get("/", (req, res) => {
    res.send("Smart Tourism Backend API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});