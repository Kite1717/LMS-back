'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var surveyGroupController = require('../controllers/surveyGroupController');

  app
    .route('/api/survey-groups')
    .get(
      authorize([UserRolIds.Admin]),
      surveyGroupController.list_all_survey_groups
    )
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyGroupController.create_a_survey_group
    );

  app
    .route('/api/survey-groups/:Id')
    .get(authorize(UserRolIds.Admin), surveyGroupController.read_a_survey_group)
    .put(
      authorize(UserRolIds.Admin),
      surveyGroupController.update_a_survey_group
    )
    .delete(
      authorize(UserRolIds.Admin),
      surveyGroupController.delete_a_survey_group
    );

  app
    .route('/api/survey-groups/find')
    .post(
      authorize(UserRolIds.Admin),
      surveyGroupController.find_survey_groups
    );

  app
    .route('/api/survey-groups/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      surveyGroupController.list_survey_groups_paged
    );

  app
    .route('/api/survey-groups/poll/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyGroupController.get_survey_by_Pollid
    );
};
