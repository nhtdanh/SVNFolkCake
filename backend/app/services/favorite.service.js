const Favorite = require("../models/Favorite");
const User = require("../models/User");

async function addFavorite(userId, cakeId) {
  let list = await Favorite.findOne({ User: userId });
  if (!list) list = new Favorite({ User: userId, cakes: [] });

  // Nếu đã có rồi, không thêm
  if (list.cakes.some((item) => item.cake.toString() === cakeId)) {
    throw new Error("Bánh đã có trong mục yêu thích.");
  }
  list.cakes.push({ cake: cakeId });
  await list.save();
  return list;
}

async function getFavorites(userId) {
  return Favorite.findOne({ User: userId }).populate("cakes.cake");
}

async function removeFavorite(userId, cakeId) {
  const list = await Favorite.findOne({ User: userId });
  if (list) {
    list.cakes = list.cakes.filter((item) => item.cake.toString() !== cakeId);
    await list.save();
  }
  return list;
}

module.exports = { addFavorite, getFavorites, removeFavorite };
