'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var meetingController = require('../controllers/meetingController');

  app
    .route('/api/meetings')
    .get(authorize(UserRolIds.Admin), meetingController.list_all_meetings)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingController.create_a_meeting
    );

  app
    .route('/api/meetings/:Id')
    .get(authorize([UserRolIds.Admin, UserRolIds.Trainer]), meetingController.read_a_meeting)
    .put(authorize([UserRolIds.Admin, UserRolIds.Trainer]), meetingController.update_a_meeting)
    .delete(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingController.delete_a_meeting
    );

  app
    .route('/api/meetings/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      meetingController.find_meetings
    );

  app
    .route('/api/meetings/page/:page')
    .get(authorize(UserRolIds.Admin), meetingController.list_meetings_paged);

  app
    .route('/api/meetings/moderator/:meeetingid/:pass')
    .get(meetingController.get_moderator_link);

  app
    .route('/api/meetings/attendee/:meeetingid/:pass/:name')
    .get(meetingController.get_attendee_link);

  app
    .route('/api/meetings-events')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin, UserRolIds.Trainer]),
      meetingController.GetAllEvents
    );
    
};
