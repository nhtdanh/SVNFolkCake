const Favorite = require("../models/Favorite");
const User = require("../models/User");
const mongoose = require("mongoose");


async function addFavorite(userId, cakeId) {
  let list = await Favorite.findOne({ user: userId });
  if (!list) list = new Favorite({ user: userId, cakes: [] });

  // Đảm bảo list.cakes là một mảng
  if (!Array.isArray(list.cakes)) {
    list.cakes = [];
  }

  // Kiểm tra xem cake đã tồn tại chưa
  if (list.cakes.some((item) => item.cake.toString() === cakeId)) {
    throw new Error("Bánh đã có trong mục yêu thích.");
  }

  list.cakes.push({ cake: cakeId });
  await list.save();
  return list;
}

async function getFavorites(userId) {
  // console.log("userId:", userId);
  const res = await Favorite.findOne({ user: userId }).populate("cakes.cake");
  return res;
}

async function removeFavorite(userId, cakeId) {
  const list = await Favorite.findOne({ user: userId });
  if (list) {
    list.cakes = list.cakes.filter((item) => item.cake.toString() !== cakeId);
    await list.save();
  }
  return list;
}

module.exports = { addFavorite, getFavorites, removeFavorite };
