'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var examQuestionController = require('../controllers/examQuestionController');

  app
    .route('/api/examQuestions')
    .get(
      authorize(UserRolIds.Admin),
      examQuestionController.list_all_examQuestions
    )
    .post(
      authorize(UserRolIds.Admin),
      examQuestionController.create_a_examQuestion
    );

  app
    .route('/api/examQuestions/:Id')
    .get(
      authorize(UserRolIds.Admin),
      examQuestionController.read_a_examQuestion
    )
    .put(
      authorize(UserRolIds.Admin),
      examQuestionController.update_a_examQuestion
    )
    .delete(
      authorize(UserRolIds.Admin),
      examQuestionController.delete_a_examQuestion
    );

  app
    .route('/api/examQuestions/find')
    .post(
      authorize(UserRolIds.Admin),
      examQuestionController.find_examQuestions
    );

  app
    .route('/api/exam-questions/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      examQuestionController.list_examQuestions_paged
    );

  app
    .route('/api/exam-questions/exam-questions-by-code/:Id')
    .get(
      authorize(UserRolIds.Employee),
      examQuestionController.get_examQuestion_by_exam_code
    );

  app
    .route('/api/exam-questions/visual-exam-questions-by-code/:Id')
    .get(
      authorize(UserRolIds.Employee),
      examQuestionController.get_visual_examQuestion_by_exam_code
    );

  app
    .route('/api/exam-questions/exam/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      examQuestionController.get_a_examQuestion_by_examId
    );
};
