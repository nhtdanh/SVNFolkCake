// app/services/detect.service.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const DETECT_URL = process.env.DETECT_URL || "http://localhost:8000/detect";
const MODELS_URL = process.env.MODELS_URL || "http://localhost:8000/models";
const TIMEOUT = parseInt(process.env.DETECT_TIMEOUT || "60000", 10);

async function detectFromFile(filePath, options = {}) {
  const { model = null, confidence = null, nms_threshold = null } = options;
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  let url = DETECT_URL;
  const params = new URLSearchParams();
  if (model !== null && model !== undefined && model !== "") {
    params.append("model", model);
  }
  if (confidence !== null && confidence !== undefined && confidence !== "") {
    params.append("confidence", confidence);
  }
  if (
    nms_threshold !== null &&
    nms_threshold !== undefined &&
    nms_threshold !== ""
  ) {
    params.append("nms_threshold", nms_threshold);
  }
  if (params.toString()) {
    url = `${url}?${params.toString()}`;
  }
  const headers = form.getHeaders();
  try {
    // console.log(`Calling YOLO service: ${url}`);
    // if (model) console.log(`Using model: ${model}`);
    const res = await axios.post(url, form, {
      headers,
      timeout: TIMEOUT,
    });
    const data = res.data;
    // if (data.success && data.detections) {
    //   console.log(
    //     `Detection completed: ${data.total_detections} objects found`
    //   );
    //   if (data.model_used) {
    //     console.log(`Model used: ${data.model_used}`);
    //   }
    // }

    return data;
  } catch (err) {
    if (err.response) {
      const msg = err.response.data || err.response.statusText;
      throw new Error(`Detect service error: ${JSON.stringify(msg)}`);
    }
    throw new Error(`Detect request failed: ${err.message}`);
  }
}
async function getModels() {
  try {
    const res = await axios.get(MODELS_URL, {
      timeout: TIMEOUT,
    });
    return res.data;
  } catch (err) {
    if (err.response) {
      const msg = err.response.data || err.response.statusText;
      throw new Error(`Models service error: ${JSON.stringify(msg)}`);
    }
    throw new Error(`Models request failed: ${err.message}`);
  }
}

module.exports = {
  detectFromFile,
  getModels,
};
