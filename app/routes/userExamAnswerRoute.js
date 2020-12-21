'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var userExamAnswerController = require('../controllers/userExamAnswerController');

  app
    .route('/api/user-exam-answers')
    .get(
      authorize(UserRolIds.Admin),
      userExamAnswerController.list_all_userExamAnswers
    )
    .post(
      authorize(UserRolIds.Employee),
      userExamAnswerController.create_a_userExamAnswer
    );

  app
    .route('/api/user-exam-answers/:Id')
    .get(
      authorize(UserRolIds.Admin),
      userExamAnswerController.read_a_userExamAnswer
    )
    .put(
      authorize(UserRolIds.Admin),
      userExamAnswerController.update_a_userExamAnswer
    )
    .delete(
      authorize(UserRolIds.Admin),
      userExamAnswerController.delete_a_userExamAnswer
    );

  app
    .route('/api/user-exam-answers/find')
    .post(
      authorize(UserRolIds.Admin),
      userExamAnswerController.find_userExamAnswers
    );

  app
    .route('/api/user-exam-answers/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      userExamAnswerController.list_userExamAnswers_paged
    );

  app
    .route('/api/user-exam-answers-tag')
    .get(
      authorize(UserRolIds.Admin),
      userExamAnswerController.list_all_userExamAnswers_as_tag
    );
};
