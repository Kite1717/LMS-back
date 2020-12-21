'use strict';

var multer = require('multer');
var path = require('path');

var myenv = process.env.NODE_ENV || 'Production';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (myenv == 'Production') {
      cb(null, '/home/code35c/public_html/soundfiles'); //TODO: change with real file path
    } else {
      cb(null, 'uploads');
    }
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
  var courseSectionsController = require('../controllers/courseSectionController');

  app
    .route('/api/course-sections')
    .get(authorize('Admin'), courseSectionsController.list_all_courseSections)
    .post(
      authorize(UserRolIds.Admin),
      courseSectionsController.create_a_courseSection
    );

  app
    .route('/api/course-sections/:Id')
    .get(
      authorize(UserRolIds.Admin),
      courseSectionsController.read_a_courseSection
    )
    .put(
      authorize(UserRolIds.Admin),
      courseSectionsController.update_a_courseSection
    )
    .delete(
      authorize(UserRolIds.Admin),
      courseSectionsController.delete_a_courseSection
    );

  app
    .route('/api/course-sections/page/:page')
    .get(
      authorize('Admin'),
      courseSectionsController.list_course_sections_paged
    );

  app
    .route('/api/course-sections/find')
    .post(
      authorize(UserRolIds.Admin),
      courseSectionsController.find_courseSections
    );

  app
    .route('/api/course-sections/upload/upload-file')
    .post(
      authorize(UserRolIds.Admin),
      upload.single('file'),
      courseSectionsController.add_file
    );
};
