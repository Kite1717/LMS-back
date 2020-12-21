'use strict';

var multer = require('multer');
var path = require('path');

var myenv = process.env.NODE_ENV || 'Production';

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
  var allowedIpsController = require('../controllers/allowedIpController');

  app
    .route('/api/allowed-ips')
    .get(authorize('Admin'), allowedIpsController.list_all_allowedIps)
    .post(authorize(UserRolIds.Admin), allowedIpsController.create_a_allowedIp);

  app
    .route('/api/allowed-ips/:Id')
    .get(authorize(UserRolIds.Admin), allowedIpsController.read_a_allowedIp)
    .put(authorize(UserRolIds.Admin), allowedIpsController.update_a_allowedIp)
    .delete(
      authorize(UserRolIds.Admin),
      allowedIpsController.delete_a_allowedIp
    );

  app
    .route('/api/allowed-ips/page/:page')
    .get(authorize('Admin'), allowedIpsController.list_allowedIps_paged);

  app
    .route('/api/allowed-ips/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      allowedIpsController.find_allowedIps
    );

  app
    .route('/api/allowed-ips/upload/upload-file')
    .post(
      authorize(UserRolIds.Admin),
      upload.single('file'),
      allowedIpsController.add_file
    );
};
