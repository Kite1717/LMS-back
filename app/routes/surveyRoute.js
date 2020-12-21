'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var surveyController = require('../controllers/surveyController');

  app
    .route('/api/surveys')
    .get(authorize([UserRolIds.Admin]), surveyController.list_all_surveys)
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.create_a_survey
    );

  app
    .route('/api/surveys/:Id')
    .get(authorize(UserRolIds.Admin), surveyController.read_a_survey)
    .put(authorize(UserRolIds.Admin), surveyController.update_a_survey)
    .delete(authorize(UserRolIds.Admin), surveyController.delete_a_survey);

  app
    .route('/api/surveys/find')
    .post(authorize(UserRolIds.Admin), surveyController.find_surveys);

  app
    .route('/api/surveys/page/:page')
    .get(authorize(UserRolIds.Admin), surveyController.list_surveys_paged);

  app
    .route('/api/surveys/course/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.get_survey_by_courseid
    );

  app
    .route('/api/surveys/course-code/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.getSurveyByUserCourseCode
    );

    app
    .route('/api/surveys/user/answer/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.surveysUserAnswerById
    );


    
    app
    .route('/api/surveys/user/answer/all/count/:id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.surveysAllAnswerStattisticByCourseId
    );
   

    app
    .route('/api/surveys/user/get/answer/:id/:courseId')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.courseSurveyAnswersByUserId
    );


    app
    .route('/api/surveys/user/get/comment/answer/:id/:courseId')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      surveyController.userSurveyCommentByUserIdAndCourseId
    );


    
};
