const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/review.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("/", authenticate, reviewCtrl.create);
router.patch("/:id", authenticate, reviewCtrl.update);
router.delete("/:id", authenticate, authorize("Admin"), reviewCtrl.remove);
router.get("/cake/:cakeId", reviewCtrl.listByCake);
router.get("/me", authenticate, reviewCtrl.listByUser);

module.exports = router;
