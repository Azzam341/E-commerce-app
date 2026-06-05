console.log("UPLOAD LOADED");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(null, true);
  }

  const allowed = /jpeg|jpg|png|webp/;

  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(null, false); // ❗ DO NOT throw error
  }
};
module.exports = multer({
  storage,
  fileFilter
});