const express = require("express");
const router = express.Router();
const recipeCtrl = require("../controllers/recipe.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// Public
router.get("/", recipeCtrl.listAll);
router.get("/:id", recipeCtrl.getById);
router.get("/cake/:cakeId", recipeCtrl.listByCake);

// Admin 
router.post("/", authenticate, authorize("Admin"), recipeCtrl.create);
router.patch("/:id", authenticate, authorize("Admin"), recipeCtrl.update);
router.delete("/:id", authenticate, authorize("Admin"), recipeCtrl.remove);

module.exports = router;
