'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var certificatenController = require('../controllers/certificateController');

  app
    .route('/api/certificates/find')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Employee,
      ]),
      certificatenController.findCertificate
    );
};
