'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var examController = require('../controllers/visualExamController');

  app
    .route('/api/visual-exams')
    .get(authorize(UserRolIds.Admin), examController.list_all_visual_exams)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.create_a_visual_exam
    );

  app
    .route('/api/visual-exams/:Id')
    .get(authorize(UserRolIds.Admin), examController.read_a_visual_exam)
    .put(authorize(UserRolIds.Admin), examController.update_a_visual_exam)
    .delete(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.delete_a_visual_exam
    );

  app
    .route('/api/visual-exams/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examController.find_visual_exams
    );

  

  app
    .route('/api/visual-exams/page/:page')
    .get(authorize(UserRolIds.Admin), examController.list_visual_exams_paged);

  app
    .route('/api/visual-exams-tag')
    .get(
      authorize(UserRolIds.Admin),
      examController.list_all_visual_exams_as_tag
    );

    app
    .route('/api/visual-exams/answers/from/admin/:Id/:ExamId')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      examController.visual_exams_answers_from_admin
    );
};
