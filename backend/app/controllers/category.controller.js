const categoryService = require("../services/category.service");
const ApiError = require("../api-error");

async function create(req, res, next) {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return next(new ApiError(400, "Name is required"));
    }

    const category = await categoryService.create(name, description, image);
    res.status(201).json(category);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function update(req, res, next) {
  try {
    const { name, description, image } = req.body;
    const category = await categoryService.update(
      req.params.id,
      name,
      description,
      image
    );
    res.json(category);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function remove(req, res, next) {
  try {
    await categoryService.remove(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function list(req, res, next) {
  try {
    const categories = await categoryService.list();
    res.json(categories);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function getById(req, res, next) {
  try {
    const category = await categoryService.getById(req.params.id);
    res.json(category);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

module.exports = {
  create,
  update,
  remove,
  list,
  getById,
};
