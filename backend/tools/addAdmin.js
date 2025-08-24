const mongoose = require("mongoose");
const Admin = require("../app/models/Admin"); 
require("dotenv").config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const admin = {
  user: "68a87bc69f888503b04c06fe", // <-- đổi thành user._id (chuỗi ObjectId), ví dụ: "64f2a1b2c3d4e5f678901234"
  salary: 12000000, // số nguyên (VNĐ) — chỉnh theo cần thiết
  hireDate: "2010-03-01T00:00:00.000Z", // ISO string hoặc bạn có thể để undefined để dùng default Date.now
};
Admin.insertOne(admin)
  .then(() => {
    console.log("Đã thêm dữ liệu bánh thành công!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Lỗi khi thêm dữ liệu:", error);
    mongoose.connection.close();
  });
