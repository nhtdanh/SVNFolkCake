const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./app/routes");
const ApiError = require("./app/api-error");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const publicPathDirectory = path.join(__dirname, "public");
app.use("/public", express.static(publicPathDirectory));

app.get("/", (req, res) => {
  res.json({
    code: 0,
    msg: "OK",
    data: "Welcome to the application",
  });
});

app.use("/api/v1", router);

// Handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  // Xử lí lỗi đưa qua next(err)
  return res.status(err.statusCode || 500).json({
    code: err.statusCode || 500,
    msg: err.message || "Internal Server Error",
    data: null,
  });
});

module.exports = app;
