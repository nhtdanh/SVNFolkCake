const favoriteService = require("../services/favorite.service");
const ApiError = require("../api-error");

// POST /favorite
async function add(req, res, next) {
  try {
    const result = await favoriteService.addFavorite(
      req.user.id,
      req.body.cakeId
    );
    res.json({ code: 0, msg: "Đã thêm vào yêu thích", data: result });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

// GET /favorite
async function list(req, res, next) {
  try {
    const result = await favoriteService.getFavorites(req.user.id);
    res.json({ code: 0, msg: "OK", data: result });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
}

// DELETE /favorite/:cakeId
async function remove(req, res, next) {
  try {
    const result = await favoriteService.removeFavorite(
      req.user.id,
      req.params.cakeId
    );
    res.json({ code: 0, msg: "Đã xóa khỏi danh sách yêu thích", data: result });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
}

module.exports = { add, list, remove};
