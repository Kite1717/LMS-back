'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var resumeController = require('../controllers/resumeController');

  app
    .route('/api/resumes')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      resumeController.list_all_resumes
    )
    .post(authorize([UserRolIds.Employee]), resumeController.create_a_resume);

  app
    .route('/api/resumes/:Id')
    .get(authorize(UserRolIds.Admin), resumeController.read_a_resume)
    .put(authorize(UserRolIds.Admin), resumeController.update_a_resume)
    .delete(authorize(UserRolIds.Admin), resumeController.delete_a_resume);

  app
    .route('/api/resumes/find')
    .post(authorize(UserRolIds.Admin), resumeController.find_resumes);

  app
    .route('/api/resumes/page/:page')
    .get(authorize(UserRolIds.Admin), resumeController.list_resumes_paged);
};
