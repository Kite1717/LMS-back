'use strict';

var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

const authorize = require('../helpers/authorize');
const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

module.exports = function (app) {
  var bulkFileController = require('../controllers/bulkFileController');

  app
    .route('/api/bulk-files')
    .post(authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin, UserRolIds.Trainer]), bulkFileController.create_a_bulkFile);

  app
    .route('/api/bulk-files/find')
    .post(authorize([UserRolIds.Admin]), bulkFileController.find_bulkFiles);

  app
    .route('/api/bulk-files/upload/upload-file')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin, UserRolIds.Trainer]),
      upload.single('file'),
      bulkFileController.add_file
    );
};
 