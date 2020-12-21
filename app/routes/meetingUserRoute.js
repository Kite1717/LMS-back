'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var meetingUserController = require('../controllers/meetingUserController');

  app
    .route('/api/meeting-users')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingUserController.list_all_meetingUsers
    )
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingUserController.create_a_meetingUser
    );

  app
    .route('/api/meeting-users/:Id')
    .get(authorize(UserRolIds.Admin), meetingUserController.read_a_meetingUser)
    .put(
      authorize(UserRolIds.Admin),
      meetingUserController.update_a_meetingUser
    )
    .delete(
      authorize(UserRolIds.Admin),
      meetingUserController.delete_a_meetingUser
    );

  app
    .route('/api/meeting-users/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingUserController.find_meetingUsers
    );

  app
    .route('/api/meeting-users/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      meetingUserController.list_meetingUsers_paged
    );

  app
    .route('/api/meeting-users-tag')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingUserController.list_all_meetingUsers_as_tag
    );

  app
    .route('/api/meeting-users/user/:Id')
    .get(
      authorize(UserRolIds.Employee),
      meetingUserController.read_meetingUser_by_userid
    );

  app
    .route('/api/meeting-users/user/from/admin/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      meetingUserController.meeting_user_from_admin
    );
  app
    .route('/api/meeting-users/update-begin-end/:Id')
    .put(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingUserController.update_begin_end_a_end_meetingUser
    );

  app
    .route('/api/meeting-users/user/assigned/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee, UserRolIds.Trainer]),
      meetingUserController.get_meeting_user_assigned
    );


  app
    .route('/api/meeting-users/assigned/users/delete/:mid/:Id')
    .delete(
      authorize([UserRolIds.Admin, UserRolIds.Trainer, UserRolIds.Employee,]),
      meetingUserController.remove_by_meeting_id_user_id
    );
  /*****
   * 
   */
  app
    .route('/api/meeting-users/user/meeting/:Id/:Status')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee, UserRolIds.Trainer]),
      meetingUserController.get_users_by_meeting_id
    );
  app
  .route('/api/meeting-users/user/meeting/change/joined/status')
  .put(
    authorize([UserRolIds.Employee]),
    meetingUserController.change_user_meeting_joined_status
  );  





};
