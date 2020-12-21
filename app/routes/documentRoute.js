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
  var documentsController = require('../controllers/documentController');

  app
    .route('/api/documents')
    .get(authorize('Admin'), documentsController.list_all_documents)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentsController.create_a_document
    );

  app
    .route('/api/documents/:Id')
    .get( authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]), documentsController.read_a_document)
    .put( authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]), documentsController.update_a_document)
    .delete( authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]), documentsController.delete_a_document);

  app
    .route('/api/documents/page/:page')
    .get(authorize('Admin'), documentsController.list_course_sections_paged);

  app
    .route('/api/documents/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentsController.find_documents
    );

  app
    .route('/api/documents/upload/upload-file')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      upload.single('file'),
      documentsController.add_file
    );
};
