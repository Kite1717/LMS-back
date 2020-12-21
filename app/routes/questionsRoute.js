'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var questionController = require('../controllers/questionController');

  app
    .route('/api/questions')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      questionController.list_all_questions
    )
    .post(authorize(UserRolIds.Admin), questionController.create_a_question);

  app
    .route('/api/questions/:Id')
    .get(authorize(UserRolIds.Admin), questionController.read_a_question)
    .put(authorize(UserRolIds.Admin), questionController.update_a_question)
    .delete(authorize(UserRolIds.Admin), questionController.delete_a_question);

  app
    .route('/api/questions/find')
    .post(authorize(UserRolIds.Admin), questionController.find_questions);

  app
    .route('/api/questions/page/:page')
    .get(authorize(UserRolIds.Admin), questionController.list_questions_paged);

  app
    .route('/api/questions-tag/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      questionController.list_questionstag_by_topicid
    );

  app
    .route('/api/questions/find-by-courseid')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      questionController.get_a_quesyion_by_courseid
    );
};
