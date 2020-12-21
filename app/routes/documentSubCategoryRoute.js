'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var documentSubCategoryController = require('../controllers/documentSubCategoryController');

  app
    .route('/api/document-sub-categories')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentSubCategoryController.list_all_documentSubCategories
    )
    .post(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.create_a_documentSubCategory
    );

  app
    .route('/api/document-sub-categories/:Id')
    .get(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.read_a_documentSubCategory
    )
    .put(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.update_a_documentSubCategory
    )
    .delete(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.delete_a_documentSubCategory
    );

  app
    .route('/api/document-sub-categories/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentSubCategoryController.find_documentSubCategories
    );

  app
    .route('/api/document-sub-categories/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.list_documentSubCategories_paged
    );

  app
    .route('/api/document-sub-categories-tag')
    .get(
      authorize(UserRolIds.Admin),
      documentSubCategoryController.list_all_documentSubCategories_as_tag
    );

  app
    .route('/api/document-sub-categories/category/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentSubCategoryController.get_list_documentSubCategory_by_categoryid
    );
};
