const multer = require("multer");
const path = require("path");
const fs = require("fs");

function uploadImage(subfolder) {
  const UPLOAD_DIR = path.join(__dirname, `../../public/uploads/${subfolder}`);
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
      filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".gif", ".svg"].includes(ext))
        cb(null, true);
      else cb(new Error("Only image files are allowed"), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  });
}

module.exports = uploadImage;
