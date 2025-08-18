const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");


router.get("/dashboard", authenticate, authorize("Admin"), adminCtrl.dashboard);

module.exports = router;
