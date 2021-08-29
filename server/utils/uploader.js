const multer = require('multer');
const path = require('path');

const uploader = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'uploads'),
    filename: (req, file, cb) => {
      cb(null, `${(new Date()).getTime()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
});

module.exports = uploader;
