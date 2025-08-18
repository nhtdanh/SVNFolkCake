const detectService = require("../services/detect.service");
const ApiError = require("../api-error");
const fs = require("fs");


// POST /api/v1/detect

async function detect(req, res, next) {
  if (!req.file) return next(new ApiError(400, "No file uploaded"));

  const filePath = req.file.path;
  const confidence = req.body.confidence || req.query.confidence;
  const model = req.body.model || req.query.model;
  try {
    const result = await detectService.detectFromFile(filePath, {
      confidence,
      model,
    });
    return res.json(result);
  } catch (err) {
   
    return next(new ApiError(500, err.message || "Detect service error"));
  // } finally {
  //   // delete temp image stored in backend (to forward to detect service)
  //   try {
  //     if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //   } catch (e) {
  //     console.error("Failed to remove temp file:", filePath, e && e.message);
  //   }
  }
}

async function getModel(req, res, next){
  //
}

module.exports = { detect };
