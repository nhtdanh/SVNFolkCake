// routes/cake.routes.js
const express = require("express");
const router = express.Router();
const cakeCtrl = require("../controllers/cake.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const uploadCake = upload("cakes"); //cakes là subfolder

// Public
router.get("/", cakeCtrl.list);
router.get("/:id", cakeCtrl.getById);

// Admin
router.post("/", authenticate, authorize("Admin"), cakeCtrl.create);
router.patch("/:id", authenticate, authorize("Admin"), cakeCtrl.update);
router.delete("/:id", authenticate, authorize("Admin"), cakeCtrl.remove);

router.post(
  "/:id/upload-main",
  authenticate,
  authorize("Admin"),
  uploadCake.single("main"),
  cakeCtrl.uploadMain
);

module.exports = router;
