const cakeService = require("../services/cake.service");
const ApiError = require("../api-error");
const path = require("path");
const fs = require("fs");

async function list(req, res, next) {
  try {
    const filters = {
      q: req.query.q,
      category: req.query.category,
      tag: req.query.tag,
      minRating: req.query.minRating,
    };
    const pagination = { page: req.query.page, limit: req.query.limit };
    const result = await cakeService.list(filters, pagination);
    res.json(result);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function getById(req, res, next) {
  try {
    const cake = await cakeService.getById(req.params.id);
    res.json(cake);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function create(req, res, next) {
  try {
    const payload = req.body;
    if (!payload || !payload.name)
      return next(new ApiError(400, "Field 'name' is required"));
    const cake = await cakeService.create(payload);
    res.status(201).json(cake);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function update(req, res, next) {
  try {
    const payload = req.body;
    const cake = await cakeService.update(req.params.id, payload);
    res.json(cake);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function remove(req, res, next) {
  try {
    await cakeService.remove(req.params.id);
    res.json({ message: "Cake deleted" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function uploadMain(req, res, next) {
  try {
    if (!req.file) return next(new ApiError(400, "No file uploaded"));
    const filename = req.file.filename;
    try {
      const cake = await cakeService.updateMainImage(req.params.id, filename);
      return res.json(cake);
    } catch (err) {
      // cake not found 
      return next(new ApiError(400, err.message));
    }
  } catch (err) {
    next(new ApiError(500, err.message || "Server error"));
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  uploadMain,
};
