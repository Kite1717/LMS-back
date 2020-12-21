'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var DocumentSubCategory = function (document_sub_category) {
  this.Id = document_sub_category.Id;
  this.IsPublished = document_sub_category.IsPublished;
  this.IsDeleted = document_sub_category.IsDeleted;
  this.CreatorUserId = document_sub_category.CreatorUserId;
  this.CreatedAt = document_sub_category.CreatedAt;
  this.LastModifierUserId = document_sub_category.LastModifierUserId;
  this.UpdatedAt = document_sub_category.UpdatedAt;
  this.DeleterUserId = document_sub_category.DeleterUserId;
  this.DeletedAt = document_sub_category.DeletedAt;
  this.Name = document_sub_category.Name;
  this.DocumentCategoryId = document_sub_category.DocumentCategoryId;
};

DocumentSubCategory.createDocumentSubCategory = function (
  newDocumentSubCategory,
  callback
) {
  console.log('newDocumentSubCategory', newDocumentSubCategory);

  pool
    .query(
      'INSERT INTO document_sub_category (IsPublished,CreatorUserId,CreatedAt,Name, DocumentCategoryId) values (?,?,?,?,?)',
      [
        newDocumentSubCategory.IsPublished || null,
        newDocumentSubCategory.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newDocumentSubCategory.Name,
        newDocumentSubCategory.DocumentCategoryId,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.getDocumentSubCategoryPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/document_sub_categorys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from document_sub_category ')
    .then((res) => {
      const perPage = 10,
        totalCount = res[0].totalCount;

      const Paginate = new Pagination(
        totalCount,
        currentPage,
        pageUri,
        perPage
      );

      pool
        .query(
          'SELECT (SELECT count(*) from document_sub_category)  as linecount, b.*  from document_sub_category b LIMIT ' +
            Paginate.perPage +
            ' OFFSET ' +
            Paginate.offset
        )
        .then((res) => {
          let data = {
            items: res,
            pages: Paginate.links(),
          };

          return callback(null, data);
        });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.getDocumentSubCategoryById = function (id, callback) {
  pool
    .query('Select x.* from document_sub_category x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.getDocumentSubCategoryByDocumentCategoryId = function (
  id,
  callback
) {
  pool
    .query(
      'Select x.* from document_sub_category x where x.DocumentCategoryId = ? ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.getAllDocumentSubCategory = function (callback) {
  pool
    .query('SELECT *  from document_sub_category ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  console.log(deletedAt, uid, id, "sdsadsadsadasdasdasdasdas")

  pool
    .query(
      'UPDATE document_sub_category SET  IsDeleted = 1,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
   
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.updateById = function (
 
  id,
  document_sub_category,
  callback
) {
  document_sub_category.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
 
 
  const params = [];

  let sql = 'UPDATE document_sub_category SET  ';

  if (document_sub_category.Name) {
    sql += ' Name=?,';
    params.push(document_sub_category.Name);
  }

  if (document_sub_category.DocumentCategoryId) {
    sql += ' DocumentCategoryId=?,';
    params.push(document_sub_category.DocumentCategoryId);
  }

  if (document_sub_category.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(document_sub_category.UpdatedAt);
  }

  if (document_sub_category.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(document_sub_category.LastModifierUserId);
  }


  params.push(id);

  
  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentSubCategory.find_documentSubCategories = function (
  queryParams,
  callback
) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from document_sub_category  where IsDeleted is null ';
  let sql2 = 'SELECT  *  from document_sub_category  where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  if (
    queryParams.filter.DocumentCategoryId &&
    queryParams.filter.DocumentCategoryId != '' &&
    queryParams.filter.DocumentCategoryId != 0
  ) {
    sql += ' and DocumentCategoryId =?';
    params.push(queryParams.filter.DocumentCategoryId);

    sql2 += ' and DocumentCategoryId =?';
    params2.push(queryParams.filter.DocumentCategoryId);
  }

  sql2 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  console.log('sql', sql);

  pool
    .query(sql, params)
    .then((res) => {
      let totalCount = res[0].totalCount;
      pool.query(sql2, params2).then((res) => {
        let data = {
          entities: res,
          totalCount: totalCount,
        };
        return callback(null, data);
      });
    })
    .catch((err) => {
      console.log('err', err);
      return callback(err, null);
    });
};

module.exports = DocumentSubCategory;
