const Recipe = require("../models/Recipe");
const Cake = require("../models/Cake");

async function create(data) {
  // đảm bảo cake tồn tại
  const cake = await Cake.findById(data.cake);
  if (!cake) throw new Error("Cake not found");

  const recipe = new Recipe(data);
  await recipe.save();
  return recipe;
}

async function update(id, data) {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw new Error("Recipe not found");

  const updatable = [
    "title",
    "ingredients",
    "instructions",
    "nutritionCalories",
    "nutritionProtein",
    "nutritionCarbs",
    "nutritionFat",
    "serves",
    "cookingTime",
    "difficulty",
    "video",
  ];
  updatable.forEach((key) => {
    if (data[key] !== undefined) recipe[key] = data[key];
  });

  await recipe.save();
  return recipe;
}

async function remove(id) {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw new Error("Recipe not found");
  await recipe.remove();
}

async function getById(id) {
  const recipe = await Recipe.findById(id).populate("cake", "name");
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}

async function listByCake(cakeId, { page = 1, limit = 20 } = {}) {
  page = Math.max(1, parseInt(page));
  limit = Math.min(100, parseInt(limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Recipe.find({ cake: cakeId })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .lean(),
    Recipe.countDocuments({ cake: cakeId }),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

async function listAll({ page = 1, limit = 20 } = {}) {
  page = Math.max(1, parseInt(page));
  limit = Math.min(100, parseInt(limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Recipe.find()
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("cake", "name")
      .lean(),
    Recipe.countDocuments(),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

module.exports = {
  create,
  update,
  remove,
  getById,
  listByCake,
  listAll,
};
