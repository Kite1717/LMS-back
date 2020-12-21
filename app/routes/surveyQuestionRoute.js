'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var surveyQuestionsController = require('../controllers/surveyQuestionController');

  app
    .route('/api/survey-questions')
    .get(
      authorize([UserRolIds.Admin]),
      surveyQuestionsController.list_all_survey_questions
    )
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyQuestionsController.create_a_survey_question
    );

  app
    .route('/api/survey-questions/:Id')
    .get(
      authorize(UserRolIds.Admin),
      surveyQuestionsController.read_a_survey_question
    )
    .put(
      authorize(UserRolIds.Admin),
      surveyQuestionsController.update_a_survey_question
    )
    .delete(
      authorize(UserRolIds.Admin),
      surveyQuestionsController.delete_a_survey_question
    );

  app
    .route('/api/survey-questions/find')
    .post(
      authorize(UserRolIds.Admin),
      surveyQuestionsController.find_survey_questions
    );

  app
    .route('/api/survey-questions/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      surveyQuestionsController.list_survey_questions_paged
    );

  app
    .route('/api/survey-questions/poll/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyQuestionsController.get_questions_by_PollGroupid
    );
};
