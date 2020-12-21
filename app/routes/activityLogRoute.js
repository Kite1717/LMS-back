'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var activityLogController = require('../controllers/activityLogController');

  app
    .route('/api/activity-logs')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
        UserRolIds.Employee,
      ]),
      activityLogController.list_all_activityLogs
    );
  



    app
    .route('/api/activity-logs/exit')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
        UserRolIds.Employee,
      ]),
      activityLogController.create_activity_log
    );


    app
    .route('/api/activity-logs/total/duration/:Id')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
        UserRolIds.Employee,
      ]),
      activityLogController.calculate_total_duration
    );

    
};
