'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var helpCaategoriesController = require('../controllers/helpCaategoriesController');

  app
    .route('/api/help-categories')
    .post(
      authorize(UserRolIds.Admin),
      helpCaategoriesController.create_a_helpCaategories
    );
};
