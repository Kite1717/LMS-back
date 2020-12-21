'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var reportController = require('../controllers/reportController');

  app
    .route('/api/total-user-count')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.TotalUserCount
    );

  app
    .route('/api/theorical-question-count-by-course')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.Theorical_question_count_by_course
    );

    app
    .route('/api/all-exam/success-rate/by-user/:Id')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.All_exam_success_rate_by_user
    );

    app
    .route('/api/very-easy/visual-questions/for/dashboard')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.Very_easy_visual_questions
    );
  app
    .route('/api/visual-question-count-by-course')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.Visual_question_count_by_course
    );

  app
    .route('/api/total-library-count-by-course-category')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      reportController.Total_library_count_by_course_category
    );

  app
    .route('/api/motnhly-created-library')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.motnhly_created_library
    );

  app
    .route('/api/total-created-certificates')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.total_created_certificates
    );

  app
    .route('/api/motnhly-expired-library')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.motnhly_libraries_enddate
    );

  app
    .route('/api/user-message/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      reportController.findUserMessages
    );

  app
    .route('/api/course-usage/course/:courseid/:companyid')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.course_usage_report
    );

    app
    .route('/api/course-usage/course/filter/:courseid/:companyid')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.filter_by_course_usage_report
    );

  app
    .route('/api/exam-result/exam/:examid/:companyid')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.exam_result_report
    );

    app
    .route('/api/exam-result/exam/filter/:examid/:companyid')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.filter_by_exam_result_report
    );

  app
    .route('/api/calendar-result/exam')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      reportController.course_calendar
    );
};
