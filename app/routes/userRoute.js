'use strict';

const authorize = require('../helpers/authorize');
const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

module.exports = function (app) {
  var userController = require('../controllers/userController');

  app
    .route('/api/users')
    .get(authorize('Admin'), userController.list_all_users)
    .post(userController.create_a_user);

  app
    .route('/api/users/get-info')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      userController.read_a_user_info_by_Userid
    );

  app
    .route('/api/users/:Id')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      userController.read_a_user
    )
    .put(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      userController.update_a_user
    )
    .delete(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      userController.delete_a_user
    );

  app
    .route('/api/users/page/:page')
    .get(authorize('Admin'), userController.list_users_paged);

  app.route('/api/users/login').post(userController.login_user);

  app
    .route('/api/users/find')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      userController.find_users
    );

    app
    .route('/api/users/find/by/TcNo')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      userController.find_users_by_tc_no
    );

  app
    .route('/api/users-tag/')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      userController.list_userstag
    );

  app
    .route('/api/message-users')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.Trainer,
        UserRolIds.CompanyAdmin,
        UserRolIds.Employee,
      ]),
      userController.list_message_user
    );

  app
    .route('/api/update-user-missing-info')
    .put(
      authorize([
        UserRolIds.Employee,
        UserRolIds.Trainer,
        UserRolIds.CompanyAdmin,
        UserRolIds.Admin,
      ]),
      userController.update_user_kvvk_phone
    );

    
};
