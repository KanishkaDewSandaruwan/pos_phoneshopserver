const multer = require('multer');
const path = require('path');

const shopStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/shop');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const itemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/dealer');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadLogo = multer({ storage: shopStorage });
const uploadItem = multer({ storage: itemStorage });

module.exports = { uploadLogo, uploadItem };
