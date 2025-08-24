const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: false },

    dateOfBirth: {
      type: Date,
      required: false, // Không bắt buộc khi đăng ký
      validate: {
        validator: function (value) {
          if (!value) return true; // Cho phép bỏ trống
          const currentDate = new Date();
          const minDate = new Date("1900-01-01");
          return value <= currentDate && value >= minDate;
        },
        message: "Date of birth must be valid and not in the future",
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },

    address: { type: String, required: false },

    phoneNumber: {
      type: String,
      match: [/^[0-9]{10,11}$/, "Phone number must have 10 or 11 digits"],
      unique: true,
      sparse: true,
      required: false,
    },

    email: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
      unique: true,
    },

    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
      unique: true,
    },

    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // At least 8 chars, one uppercase, one lowercase, one number, one special char
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
        },
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      },
    },

    avatar: {
      type: String,
      default: "/public/uploads/avatars/default.jpg",
    },

    role: { type: String, enum: ["User", "Admin"], default: "User" },

    status: { type: String, enum: ["Active", "Disabled"], default: "Active" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
