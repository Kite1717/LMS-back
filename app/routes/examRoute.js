'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var examController = require('../controllers/examController');

  app
    .route('/api/exams')
    .get(authorize([UserRolIds.Admin, UserRolIds.Trainer]), examController.list_all_exams)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.create_a_exam
    );

  app
    .route('/api/exams/:Id')
    .get(authorize([UserRolIds.Admin, UserRolIds.Trainer]), examController.read_a_exam)
    .put(authorize([UserRolIds.Admin, UserRolIds.Trainer]), examController.update_a_exam)
    .delete(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.delete_a_exam
    );

  app
    .route('/api/exams/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.find_exams
    );

  app
    .route('/api/exams/page/:page')
    .get(authorize(UserRolIds.Admin), examController.list_exams_paged);

  app
    .route('/api/exams-tag')
    .get(authorize(UserRolIds.Admin), examController.list_all_exams_as_tag);
};
