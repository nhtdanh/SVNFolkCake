// controllers/user.controller.js
const userService = require("../services/user.service");
const ApiError = require("../api-error");

async function list(req, res, next) {
  try {
    const result = await userService.list({
      q: req.query.q,
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(result);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    res.json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function create(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function update(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function remove(req, res, next) {
  try {
    await userService.remove(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return next(new ApiError(400, "No file uploaded"));
    const user = await userService.updateAvatar(
      req.user.id,
      req.file.filename
    );
    res.json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

// Lấy thông tin cá nhân
async function getProfile(req, res, next) {
  try {
    const profile = await userService.getById(req.user.id);
    res.json(profile);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

// Cập nhật thông tin cá nhân
async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

// Đổi mật khẩu
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return next(new ApiError(400, "Missing password fields"));
    await userService.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadAvatar,
  getProfile,
  updateProfile,
  changePassword,
};
