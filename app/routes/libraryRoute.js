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
  var librariesController = require('../controllers/libraryController');

  app
    .route('/api/libraries')
    .get(authorize('Admin'), librariesController.list_all_libraries)
    .post(authorize(UserRolIds.Admin), librariesController.create_a_library);

  app
    .route('/api/libraries/:Id')
    .get(authorize(UserRolIds.Admin), librariesController.read_a_library)
    .put(authorize(UserRolIds.Admin), librariesController.update_a_library)
    .delete(authorize(UserRolIds.Admin), librariesController.delete_a_library);

  app
    .route('/api/libraries/page/:page')
    .get(authorize('Admin'), librariesController.list_libraries_paged);

  app
    .route('/api/libraries/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      librariesController.find_libraries
    );

  app
    .route('/api/libraries/upload/upload-file')
    .post(
      authorize(UserRolIds.Admin),
      upload.single('file'),
      librariesController.add_file
    );

  app
    .route('/api/libraries/course/:id')
    .get(
      authorize(UserRolIds.Admin, UserRolIds.Trainer),
      librariesController.get_a_library_by_courseid
    );

  app
    .route('/api/libraries/course/:courseid/category/:categoryid')
    .get(
      authorize(UserRolIds.Admin, UserRolIds.Trainer),
      librariesController.getLibraryByCourseIdCatyegoryId
    );
};
