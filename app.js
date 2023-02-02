const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middlewares/errorMiddleware");
const recipeRouter = require("./routes/recipeRoutes");
const authRouter = require("./routes/authRoutes");


const app = express();
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
};

app.use(cookieParser());   // Cookie parser
app.use(cors());           // Enable cors
app.use(mongoSanitize());  // Sanitize data
app.use(helmet());         // Set security headers
app.use(xss());            // Prevent xss attacks
app.use(hpp());            // prevent http param polution

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);


// Routes
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/auth", authRouter);

// Error handling middleware
app.use(errorHandler);


module.exports = app;

