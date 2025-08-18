const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controllers/category.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// Public
router.get("/", categoryCtrl.list);
router.get("/:id", categoryCtrl.getById);

// Admin
router.post("/", authenticate, authorize("Admin"), categoryCtrl.create);
router.patch("/:id", authenticate, authorize("Admin"), categoryCtrl.update);
router.delete("/:id", authenticate, authorize("Admin"), categoryCtrl.remove);

module.exports = router;
