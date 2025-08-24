const mongoose = require("mongoose");
const User = require("../app/models/User"); // đường dẫn đến file model Cake.js
require("dotenv").config();
// Kết nối MongoDB (thay đổi URI theo nhu cầu)
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
// users.js
const users = [
  {
    fullName: "Nguyễn Hoàng Tiến Danh",
    dateOfBirth: "2004-06-26T00:00:00.000Z",
    gender: "Male",
    address: "Cần Thơ",
    phoneNumber: "0901213109",
    email: "kn10196@gmail.com",
    username: "admin123",
    // mật khẩu mẫu (bắt buộc hash trước khi lưu): An123456!
    password: "Tiendanh123@",
  },
  {
    fullName: "Nguyễn Văn An",
    dateOfBirth: "1990-05-10T00:00:00.000Z",
    gender: "Male",
    address: "Hồ Chí Minh",
    phoneNumber: "0912345678",
    email: "nguyenvanan@example.com",
    username: "nguyenvanan",
    // mật khẩu mẫu (bắt buộc hash trước khi lưu): An123456!
    password: "An123456!",
  },
  {
    fullName: "Trần Thị Bích",
    dateOfBirth: "1988-11-22T00:00:00.000Z",
    gender: "Female",
    address: "Cần Thơ",
    phoneNumber: "0987654321",
    email: "tranthibich@example.com",
    username: "bich_tt",
    // mật khẩu mẫu: Bich@2020
    password: "Bich@2020",
  },
  {
    fullName: "Lê Văn Cường",
    dateOfBirth: "1975-03-15T00:00:00.000Z",
    gender: "Male",
    address: "Sóc Trăng",
    // no phoneNumber (optional)
    email: "lecuong75@example.com",
    username: "lecuong75",
    // mật khẩu mẫu: Cu0ng!1975
    password: "Cu0ng!1975",
  },
  {
    fullName: "Phạm Thùy Dung",
    dateOfBirth: "2000-07-20T00:00:00.000Z",
    gender: "Female",
    address: "Vũng Tàu",
    phoneNumber: "01234567890",
    email: "phamdung@example.com",
    username: "thuydung",
    // mật khẩu mẫu: Dung#2000
    password: "Dung#2000",
  },
];

User.insertMany(users)
  .then(() => {
    console.log("Đã thêm dữ liệu bánh thành công!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Lỗi khi thêm dữ liệu:", error);
    mongoose.connection.close();
  });
