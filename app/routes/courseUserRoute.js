'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var courseUserController = require('../controllers/courseUserController');

  app
    .route('/api/course-users')
    .get(authorize(UserRolIds.Admin), courseUserController.list_all_courseUsers)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      courseUserController.create_a_courseUser
    );

  app
    .route('/api/course-users/:Id')
    .get(authorize(UserRolIds.Admin), courseUserController.read_a_courseUser)
    .put(authorize(UserRolIds.Admin), courseUserController.update_a_courseUser)
    .delete(
      authorize(UserRolIds.Admin),
      courseUserController.delete_a_courseUser
    );

  app
    .route('/api/course-users/find')
    .post(authorize(UserRolIds.Admin), courseUserController.find_courseUsers);

  app
    .route('/api/course-users/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      courseUserController.list_courseUsers_paged
    );

  app
    .route('/api/course-users-tag')
    .get(
      authorize(UserRolIds.Admin),
      courseUserController.list_all_courseUsers_as_tag
    );

  app
    .route('/api/course-users/user/:Id')
    .get(
      authorize(UserRolIds.Employee),
      courseUserController.read_courseUser_by_userid
    );

  app
    .route('/api/course-users/update-begin-end/:Id')
    .put(
      authorize(UserRolIds.Employee),
      courseUserController.update_begin_end_a_end_courseUser
    );

  app
    .route('/api/course-users/all/user/')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      courseUserController.getUserAllCourse
    );

    app
    .route('/api/course-users/all/from/admin/:Id')
    .get(
      authorize([UserRolIds.Admin,UserRolIds.CompanyAdmin,UserRolIds.Trainer]),
      courseUserController.getUserAllCourseFromAdmin
    );
   

  app
    .route('/api/course-users/course/:Id')
    .get(
      authorize([UserRolIds.Admin,UserRolIds.Trainer]),
      courseUserController.getUsersByUserCourseId
    );

  app
    .route('/api/course-users/:cid/:Id')
    .delete(
      authorize([UserRolIds.Admin,UserRolIds.Trainer]),
      courseUserController.removeByCourseIdUserId
    );
};
