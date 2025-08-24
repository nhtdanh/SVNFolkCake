const Cake = require("../models/Cake");
const path = require("path");

const PUBLIC_PREFIX = "/public/uploads/cakes";

async function list(filters = {}, pagination = {}) {
  const { q, category, tag, minRating } = filters;
  let { page = 1, limit = 20 } = pagination;

  const query = {};
  if (q) {
    query.$or = [
      { name: new RegExp(q, "i") },
      // { description: new RegExp(q, "i") },
    ];
  }
  if (category) query.category = category;
  if (tag) query.tag = tag;
  if (minRating !== undefined)
    query["rating.average"] = { $gte: Number(minRating) };

  page = Math.max(1, parseInt(page));
  limit = Math.min(100, parseInt(limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Cake.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("category", "name"),
    Cake.countDocuments(query),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

async function getById(id) {
  const cake = await Cake.findById(id).populate("category", "name");
  if (!cake) throw new Error("Cake not found");
  return cake;
}

async function create(data) {
  const cake = new Cake(data);
  await cake.save();
  return cake;
}

async function update(id, data) {
  const cake = await Cake.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!cake) throw new Error("Cake not found");
  return cake;
}

async function remove(id) {
  const cake = await Cake.findByIdAndDelete(id);
  if (!cake) throw new Error("Cake not found");
  return;
}

async function updateMainImage(id, filename) {
  const imgPath = filename
    ? `${PUBLIC_PREFIX}/${filename}`
    : `${PUBLIC_PREFIX}/default.jpg`;
  const cake = await Cake.findByIdAndUpdate(
    id,
    { "image.main": imgPath, updatedAt: Date.now() },
    { new: true }
  );
  if (!cake) throw new Error("Cake not found");
  return cake;
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  updateMainImage,
};
