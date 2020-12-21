'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var userExamController = require('../controllers/userExamController');

  app
    .route('/api/user-exams')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      userExamController.list_all_userExams
    )
    .post(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      userExamController.create_a_userExam
    );

  app
    .route('/api/user-exams/:Id')
    .get(authorize(UserRolIds.Admin), userExamController.read_a_userExam)
    .put(authorize(UserRolIds.Admin), userExamController.update_a_userExam)
    .delete(authorize(UserRolIds.Admin), userExamController.delete_a_userExam);

  app
    .route('/api/user-exams/find')
    .post(authorize(UserRolIds.Admin), userExamController.find_userExams);

  app
    .route('/api/user-exams/page/:page')
    .get(authorize(UserRolIds.Admin), userExamController.list_userExams_paged);

  app
    .route('/api/user-exams-tag')
    .get(
      authorize(UserRolIds.Admin),
      userExamController.list_all_userExams_as_tag
    );

  app
    .route('/api/user-exams/user/:Id')
    .get(
      authorize(UserRolIds.Employee),
      userExamController.read_userExam_by_userid
    );

  app
    .route('/api/user-exams/update-begin-end/:Id')
    .put(authorize(UserRolIds.Employee), userExamController.update_a_userExam);

  app
    .route('/api/find-certificate')
    .get(authorize(UserRolIds.Employee), userExamController.find_certificates);

    app
    .route('/api/find-certificate/from/admin/:Id')
    .get(authorize([UserRolIds.Admin,UserRolIds.CompanyAdmin,UserRolIds.Trainer]), userExamController.find_certificates_from_admin);

  app
    .route('/api/user-exams/all/user/')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee]),
      userExamController.getUsersAllExam
    );
    app
    .route('/api/user-exams/all/from/admin/:Id')
    .get(
      authorize([UserRolIds.Admin,UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      userExamController.getUserAllExamsFromAdmin
    );

    
    app
    .route('/api/user-exams/answers/from/admin/:Id/:ExamId')
    .get(
      authorize([UserRolIds.Admin,UserRolIds.Trainer,UserRolIds.CompanyAdmin]),
      userExamController.getUserExamsAnswersFromAdmin
    );


  app
    .route('/api/user-exams/user/exam/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Employee, UserRolIds.Trainer]),
      userExamController.getUsersByExamId
    );

  app
    .route('/api/user-exams/:eid/:Id')
    .delete(
      authorize([UserRolIds.Admin,UserRolIds.Trainer]),
      userExamController.removeByExamIdUserId
    );
};
