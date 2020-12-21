'use strict';

const enums = require('../helpers/enums');
const UserRolIds = enums.UserRolIds;

const authorize = require('../helpers/authorize');

module.exports = function (app) {
  var libraryCategoryController = require('../controllers/libraryCategoryController');

  app
    .route('/api/library-categories')
    .get(
      authorize(UserRolIds.Admin),
      libraryCategoryController.list_all_libraryCategories
    )
    .post(
      authorize(UserRolIds.Admin),
      libraryCategoryController.create_a_libraryCategory
    );

  app
    .route('/api/library-categories/:Id')
    .get(
      authorize(UserRolIds.Admin),
      libraryCategoryController.read_a_libraryCategory
    )
    .put(
      authorize(UserRolIds.Admin),
      libraryCategoryController.update_a_libraryCategory
    )
    .delete(
      authorize(UserRolIds.Admin),
      libraryCategoryController.delete_a_libraryCategory
    );

  app
    .route('/api/library-categories/find')
    .post(
      authorize([UserRolIds.Admin,UserRolIds.CompanyAdmin,UserRolIds.Trainer]),
      libraryCategoryController.find_libraryCategories
    );

  app
    .route('/api/library-categories/page/:page')
    .get(
      authorize(UserRolIds.Admin),
      libraryCategoryController.list_libraryCategories_paged
    );

  app
    .route('/api/library-categories-tag/')
    .get(
      authorize([UserRolIds.Admin,UserRolIds.CompanyAdmin,UserRolIds.Trainer]),
      libraryCategoryController.list_library_Categoriestag
    );

  app
    .route('/api/library-categories/course/:Id')
    .get(
      authorize([UserRolIds.Admin, UserRolIds.Trainer]),
      libraryCategoryController.getAllLibraryByCategories
    );
};
