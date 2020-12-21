'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var coursePackageController = require('../controllers/coursePackageController');

  app
    .route('/api/course-packages')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      coursePackageController.list_all_course_packages
    )
    .post(
      authorize(UserRolIds.Admin),
      coursePackageController.create_a_course_package
    );

  app
    .route('/api/course-packages/:Id')
    .get(
      authorize(UserRolIds.Admin),
      coursePackageController.read_a_course_package
    )
    .put(
      authorize(UserRolIds.Admin),
      coursePackageController.update_a_course_package
    )
    .delete(
      authorize(UserRolIds.Admin),
      coursePackageController.delete_a_course_package
    );

  app
    .route('/api/course-packages/find')
    .post(
      authorize([UserRolIds.Admin]),
      coursePackageController.find_course_packages
    );

  app
    .route('/api/course-packages/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      coursePackageController.list_course_packages_paged
    );
};
