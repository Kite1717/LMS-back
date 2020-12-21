'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var companyController = require('../controllers/companyController');

  app
    .route('/api/companies')
    .get(
      authorize([
        UserRolIds.Admin,
        UserRolIds.CompanyAdmin,
        UserRolIds.Trainer,
      ]),
      companyController.list_all_companies
    )
    .post(authorize(UserRolIds.Admin), companyController.create_a_company);

  app
    .route('/api/companies/:Id')
    .get(authorize(UserRolIds.Admin), companyController.read_a_company)
    .put(authorize(UserRolIds.Admin), companyController.update_a_company)
    .delete(authorize(UserRolIds.Admin), companyController.delete_a_company);

  app
    .route('/api/companies/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      companyController.find_companies
    );

  app
    .route('/api/companies/page/:page')
    .get(authorize(UserRolIds.Admin), companyController.list_companies_paged);

  app
    .route('/api/companies-tag')
    .get(
      authorize(UserRolIds.Admin),
      companyController.list_all_companies_as_tag
    );
};
