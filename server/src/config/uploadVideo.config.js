const multer = require("multer");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload video"), false);
  }
}

const uploadVideo = multer({
  storage,
  limits: {
    // Keep video short/optimized for 10s preview use-case
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = uploadVideo;
