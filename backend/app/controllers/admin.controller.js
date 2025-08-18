// controllers/admin.controller.js
const adminService = require("../services/admin.service");
const ApiError = require("../api-error");

async function dashboard(req, res, next) {
  try {
    const stats = await adminService.dashboardStats();
    res.json(stats);
  } catch (err) {
    next(new ApiError(500, err.message));
  }
}

module.exports = { dashboard };
