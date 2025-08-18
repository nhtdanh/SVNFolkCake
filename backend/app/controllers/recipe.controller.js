// controllers/recipe.controller.js
const recipeService = require("../services/recipe.service");
const ApiError = require("../api-error");

async function create(req, res, next) {
  try {
    // body should include at least cake (id)
    const payload = req.body;
    if (!payload || !payload.cake) {
      return next(new ApiError(400, "Field 'cake' (cakeId) is required"));
    }

    // optional: validate difficulty if present
    if (
      payload.difficulty &&
      !["Easy", "Medium", "Hard"].includes(payload.difficulty)
    ) {
      return next(
        new ApiError(400, "difficulty must be one of 'Easy','Medium','Hard'")
      );
    }

    const recipe = await recipeService.create(payload);
    return res.status(201).json(recipe);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function update(req, res, next) {
  try {
    const payload = req.body;
    if (
      payload.difficulty &&
      !["Easy", "Medium", "Hard"].includes(payload.difficulty)
    ) {
      return next(
        new ApiError(400, "difficulty must be one of 'Easy','Medium','Hard'")
      );
    }

    const recipe = await recipeService.update(req.params.id, payload);
    return res.json(recipe);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function remove(req, res, next) {
  try {
    await recipeService.remove(req.params.id);
    return res.json({ message: "Recipe deleted" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function getById(req, res, next) {
  try {
    const recipe = await recipeService.getById(req.params.id);
    return res.json(recipe);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function listByCake(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.listByCake(req.params.cakeId, {
      page,
      limit,
    });
    return res.json(result);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function listAll(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await recipeService.listAll({ page, limit });
    return res.json(result);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

module.exports = {
  create,
  update,
  remove,
  getById,
  listByCake,
  listAll,
};
