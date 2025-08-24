const mongoose = require("mongoose");
const Category = require("../app/models/Category"); // đường dẫn đến file model Cake.js
require("dotenv").config();
// Kết nối MongoDB (thay đổi URI theo nhu cầu)
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
// Dữ liệu các loại bánh
const categories = [
  { name: "Bánh Hấp", image: "", description: "" },
  { name: "Bánh Chiên", image: "", description: "" },
  { name: "Bánh Nướng", image: "", description: "" },
  { name: "Bánh Luộc", image: "", description: "" },
  { name: "Bánh Sống", image: "", description: "" },
];

// Chèn dữ liệu vào MongoDB
Category.insertMany(categories)
  .then(() => {
    console.log("Đã thêm dữ liệu bánh thành công!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Lỗi khi thêm dữ liệu:", error);
    mongoose.connection.close();
  });
