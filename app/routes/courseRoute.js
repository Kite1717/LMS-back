'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var courseController = require('../controllers/courseController');

  app
    .route('/api/courses')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      courseController.list_all_courses
    )
    .post(authorize(UserRolIds.Admin), courseController.create_a_course);

  app
    .route('/api/courses/:Id')
    .get(authorize(UserRolIds.Admin), courseController.read_a_course)
    .put(authorize(UserRolIds.Admin), courseController.update_a_course)
    .delete(authorize(UserRolIds.Admin), courseController.delete_a_course);

  app
    .route('/api/courses/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      courseController.find_courses
    );

  app
    .route('/api/courses/page/:page')
    .get(authorize(UserRolIds.Admin), courseController.list_courses_paged);
};
