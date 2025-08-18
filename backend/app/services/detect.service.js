// app/services/detect.service.js
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const DETECT_URL = process.env.DETECT_URL || "http://localhost:8001/detect";
const TIMEOUT = parseInt(process.env.DETECT_TIMEOUT || "60000", 10);

async function detectFromFile(filePath, options = {}) {
  const { confidence = null, model = null } = options;

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  // Construct URL with parameters
  let url = DETECT_URL;
  const params = new URLSearchParams();

  if (confidence !== null && confidence !== undefined) {
    params.append("confidence", confidence);
  }

  if (model !== null && model !== undefined) {
    params.append("model", model);
  }

  // Add params to URL if any exist
  if (params.toString()) {
    const separator = DETECT_URL.includes("?") ? "&" : "?";
    url = `${DETECT_URL}${separator}${params.toString()}`;
  }

  const headers = form.getHeaders();

  try {
    console.log(`Calling YOLO service: ${url}`);
    if (model) console.log(`Using model: ${model}`);
    if (confidence) console.log(`Using confidence: ${confidence}`);

    const res = await axios.post(url, form, {
      headers,
      timeout: TIMEOUT,
    });

    // Log detection results summary
    const data = res.data;
    if (data.success && data.detections) {
      console.log(
        `Detection completed: ${data.total_detections} objects found`
      );
      if (data.model_used) {
        console.log(`Model used: ${data.model_used}`);
      }
    }

    return data;
  } catch (err) {
    // normalize error
    if (err.response) {
      // microservice returned non-2xx
      const msg = err.response.data || err.response.statusText;
      throw new Error(`Detect service error: ${JSON.stringify(msg)}`);
    }
    throw new Error(`Detect request failed: ${err.message}`);
  }
}

module.exports = { detectFromFile };
