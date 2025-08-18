const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const detectCtrl = require("../controllers/detect.controller");

const uploadTemp = upload("detect");

router.get("/models", detectCtrl.getModels);
router.post("/", uploadTemp.single("image"), detectCtrl.detect);

module.exports = router;
