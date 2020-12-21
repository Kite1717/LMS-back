'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var visualQuestionController = require('../controllers/visualQuestionController');

  app
    .route('/api/visual-questions')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      visualQuestionController.list_all_visualQuestions
    )
    .post(
      authorize(UserRolIds.Admin),
      visualQuestionController.create_a_visualQuestion
    );

  app
    .route('/api/visual-questions/:Id')
    .get(
      authorize(UserRolIds.Admin),
      visualQuestionController.read_a_visualQuestion
    )
    .put(
      authorize(UserRolIds.Admin),
      visualQuestionController.update_a_visualQuestion
    )
    .delete(
      authorize(UserRolIds.Admin),
      visualQuestionController.delete_a_visualQuestion
    );

  app
    .route('/api/visual-questions/find')
    .post(
      authorize(UserRolIds.Admin),
      visualQuestionController.find_visualQuestions
    );

  app
    .route('/api/visual-questions/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      visualQuestionController.list_visualQuestions_paged
    );

  app
    .route('/api/visual-questions-tag/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      visualQuestionController.list_visualQuestionstag_by_topicid
    );

  app
    .route('/api/visual-questions/find-by-courseid')
    .post(
      authorize(UserRolIds.Admin, UserRolIds.Trainer),
      visualQuestionController.get_a_visualQuestion_by_courseid
    );

  app
    .route('/api/visual-questions/examid/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      visualQuestionController.get_visualQuestions_by_courseid
    );
};
