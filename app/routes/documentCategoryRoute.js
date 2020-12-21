'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var documentCategoryController = require('../controllers/documentCategoryController');

  app
    .route('/api/document-categories')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentCategoryController.list_all_documentCategories
    )
    .post(
      authorize(UserRolIds.Admin),
      documentCategoryController.create_a_documentCategory
    );

  app
    .route('/api/document-categories/:Id')
    .get(
      authorize(UserRolIds.Admin),
      documentCategoryController.read_a_documentCategory
    )
    .put(
      authorize(UserRolIds.Admin),
      documentCategoryController.update_a_documentCategory
    )
    .delete(
      authorize(UserRolIds.Admin),
      documentCategoryController.delete_a_documentCategory
    );

  app
    .route('/api/document-categories/find')
    .post(
      authorize([UserRolIds.Admin, UserRolIds.CompanyAdmin]),
      documentCategoryController.find_documentCategories
    );

  app
    .route('/api/document-categories/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      documentCategoryController.list_documentCategories_paged
    );

  app
    .route('/api/document-categories-tag')
    .get(
      authorize(UserRolIds.Admin),
      documentCategoryController.list_all_documentCategories_as_tag
    );
};
