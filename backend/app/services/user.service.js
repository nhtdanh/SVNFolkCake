// services/user.service.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const PUBLIC_PREFIX = "/public/uploads/avatars";

async function list({ q, page = 1, limit = 20 }) {
  const query = {};
  if (q) {
    query.$or = [
      { username: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
    ];
  }

  page = Math.max(1, parseInt(page));
  limit = Math.min(100, parseInt(limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    User.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .select("-password"),
    User.countDocuments(query),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

async function getById(id) {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
}

async function create(data) {
  const user = new User(data);
  await user.save();
  return user;
}

async function update(id, data) {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) throw new Error("User not found");
  return user;
}

async function remove(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return;
}

async function updateAvatar(id, filename) {
  const avatarPath = filename
    ? `${PUBLIC_PREFIX}/${filename}`
    : `${PUBLIC_PREFIX}/default.jpg`;
  const user = await User.findByIdAndUpdate(
    id,
    { avatar: avatarPath, updatedAt: Date.now() },
    { new: true }
  ).select("-password");
  if (!user) throw new Error("User not found");
  return user;
}


async function updateProfile(userId, data) {
  delete data.role;
  return update(userId, data);
}


async function changePassword(userId, oldPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error("Old password is incorrect");
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  updateAvatar,
  updateProfile,
  changePassword,
};
