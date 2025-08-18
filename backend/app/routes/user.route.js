const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const uploadAvatar = upload("avatars");

// Admin
router.get("/", authenticate, authorize("Admin"), userCtrl.list);
router.get("/:id", authenticate, authorize("Admin"), userCtrl.getById);
router.post("/", authenticate, authorize("Admin"), userCtrl.create);
router.patch("/:id", authenticate, authorize("Admin"), userCtrl.update);
router.delete("/:id", authenticate, authorize("Admin"), userCtrl.remove);

// User
router.get("/me/profile", authenticate, userCtrl.getProfile);
router.patch("/me/profile", authenticate, userCtrl.updateProfile);
router.patch("/me/change-password", authenticate, userCtrl.changePassword);
router.post(
  "/me/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  userCtrl.uploadAvatar
);

module.exports = router;
