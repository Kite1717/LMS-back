'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var helpController = require('../controllers/helpController');

  app
    .route('/api/helps')
    .get(authorize([UserRolIds.Admin]), helpController.list_all_helps)
    .post(
      authorize([
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
        UserRolIds.Employee,
      ]), //TODO: Employee silinecek sadece test için
      helpController.create_a_help
    );

  app
    .route('/api/helps/:Id')
    .get(authorize(UserRolIds.Admin), helpController.read_a_help)
    .put(authorize(UserRolIds.Admin), helpController.update_a_help)
    .delete(authorize(UserRolIds.Admin), helpController.delete_a_help);

  app
    .route('/api/helps/find')
    .post(authorize(UserRolIds.Admin), helpController.find_helps);

  app
    .route('/api/helps/page/:page')
    .get(authorize(UserRolIds.Admin), helpController.list_helps_paged);
};
