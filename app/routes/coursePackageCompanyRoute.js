'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var coursePackageCompanyController = require('../controllers/coursePackageCompanyController');

  app
    .route('/api/course-package-companies')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      coursePackageCompanyController.list_all_course_packages_companys_companies
    )
    .post(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.create_a_course_packages_company
    );

  app
    .route('/api/course-package-companies/:Id')
    .get(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.read_a_course_packages_company
    )
    .put(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.update_a_course_packages_company
    )
    .delete(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.delete_a_course_packages_company
    );

  app
    .route('/api/course-package-companies/find')
    .post(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      coursePackageCompanyController.find_course_packages_companys_companies
    );

  app
    .route('/api/course-package-companies/packageid/:Id')
    .get(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.getCoursePackageCompanyByPackageId
    );

  app
    .route('/api/course-package-companies/:pid/:cid')
    .delete(
      authorize(UserRolIds.Admin),
      coursePackageCompanyController.delete_a_course_packages_company_packaid_companyid
    );
};
