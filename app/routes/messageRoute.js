'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var messageController = require('../controllers/messageController');



  app
    .route('/api/messages')
    .get(authorize([UserRolIds.Admin,UserRolIds.Employee,UserRolIds.Trainer,UserRolIds.CompanyAdmin]), messageController.list_all_messages)
    .post(authorize([UserRolIds.Admin,UserRolIds.Employee,UserRolIds.Trainer,UserRolIds.CompanyAdmin]), messageController.create_a_message);

  app
    .route('/api/messages/view/:Id')
    .get(authorize([UserRolIds.Admin,UserRolIds.Employee,UserRolIds.Trainer,UserRolIds.CompanyAdmin]), messageController.viewing_message);

  app
    .route('/api/messages/:Id')
    .get(authorize(UserRolIds.Admin), messageController.read_a_message)
    .put(authorize(UserRolIds.Admin), messageController.update_a_message)
    .delete(authorize(UserRolIds.Admin), messageController.delete_a_message)
 

  app
    .route('/api/messages/find')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.Employee,
        UserRolIds.Trainer,
        UserRolIds.CompanyAdmin,
      ]),
      messageController.find_messages
    );

  app
    .route('/api/messages/page/:page')
    .get(authorize(UserRolIds.Admin), messageController.list_messages_paged);

  app
    .route('/api/messages/moderator/:meeetingid/:pass')
    .get(messageController.get_moderator_link);

  app
    .route('/api/messages/attendee/:meeetingid/:pass/:name')
    .get(messageController.get_attendee_link);


   
};
