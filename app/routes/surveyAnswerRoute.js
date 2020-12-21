'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var surveyAnswerController = require('../controllers/surveyAnswerController');

  app
    .route('/api/survey-answers')
    .get(
      authorize([UserRolIds.Admin]),
      surveyAnswerController.list_all_survey_answers
    )
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyAnswerController.create_a_survey_answer
    );

  app
    .route('/api/survey-answers/:Id')
    .get(
      authorize(UserRolIds.Admin),
      surveyAnswerController.read_a_survey_answer
    )
    .put(
      authorize(UserRolIds.Admin),
      surveyAnswerController.update_a_survey_answer
    )
    .delete(
      authorize(UserRolIds.Admin),
      surveyAnswerController.delete_a_survey_answer
    );

  app
    .route('/api/survey-answers/find')
    .post(
      authorize(UserRolIds.Admin),
      surveyAnswerController.find_survey_answers
    );

  app
    .route('/api/survey-answers/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      surveyAnswerController.list_survey_answers_paged
    );

  app
    .route('/api/survey-answers/poll/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyAnswerController.get_survey_by_Pollid
    );
};
