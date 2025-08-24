const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const favoriteCtrl = require("../controllers/favorite.controller");

router.use(authenticate);

router.get("/", favoriteCtrl.list);
router.post("/:cakeId", favoriteCtrl.add);
router.delete("/:cakeId", favoriteCtrl.remove);

module.exports = router;
