const multer = require("multer");

const storage = multer.memoryStorage();
// chỉ cho phép file ảnh
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload ảnh"), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
  fileFilter,
});

module.exports= upload;