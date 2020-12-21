'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;
const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var topicController = require('../controllers/topicController');

  app
    .route('/api/topics')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      topicController.list_all_topics
    )
    .post(authorize(UserRolIds.Admin), topicController.create_a_topic);

  app
    .route('/api/topics/:Id')
    .get(authorize(UserRolIds.Admin), topicController.read_a_topic)
    .put(authorize(UserRolIds.Admin), topicController.update_a_topic)
    .delete(authorize(UserRolIds.Admin), topicController.delete_a_topic);

  app
    .route('/api/topics/find')
    .post(authorize(UserRolIds.Admin), topicController.find_topics);

  app
    .route('/api/topics/page/:page')
    .get(authorize(UserRolIds.Admin), topicController.list_topics_paged);

  app
    .route('/api/topics/course/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee, UserRolIds.Trainer]),
      topicController.list_topics_by_courseid
    );

  app
    .route('/api/topics/course/with-section/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      topicController.list_topics_by_courseid_with_sections
    );
};
