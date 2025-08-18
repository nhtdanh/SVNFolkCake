const Category = require("../models/Category");

async function create(name, description, image) {
  const category = new Category({
    name,
    description: description || "",
    image: image || "",
  });
  await category.save();
  return category;
}

async function update(id, name, description, image) {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;

  await category.save();
  return category;
}

async function remove(id) {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");
  await category.remove();
}

async function list() {
  return Category.find();
}

async function getById(id) {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");
  return category;
}

module.exports = {
  create,
  update,
  remove,
  list,
  getById,
};
