'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var DocumentCategory = function (document_category) {
  this.Id = document_category.Id;
  this.IsPublished = document_category.IsPublished;
  this.IsDeleted = document_category.IsDeleted;
  this.CreatorUserId = document_category.CreatorUserId;
  this.CreatedAt = document_category.CreatedAt;
  this.LastModifierUserId = document_category.LastModifierUserId;
  this.UpdatedAt = document_category.UpdatedAt;
  this.DeleterUserId = document_category.DeleterUserId;
  this.DeletedAt = document_category.DeletedAt;
  this.Name = document_category.Name;
};

DocumentCategory.createDocumentCategory = function (
  newDocumentCategory,

  callback
) {
  pool
    .query(
      'INSERT INTO document_category (IsPublished,CreatorUserId,CreatedAt,Name) values (?,?,?,?)',
      [
        newDocumentCategory.IsPublished || null,
        newDocumentCategory.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newDocumentCategory.Name,
      ]
    )
    .then((res) => {
      newDocumentCategory.Id = res.insertId;
      return callback(null, newDocumentCategory);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentCategory.getDocumentCategoryPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/document_categorys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from document_category ')
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
          'SELECT (SELECT count(*) from document_category)  as linecount, b.*  from document_category b LIMIT ' +
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

DocumentCategory.getDocumentCategoryById = function (id, callback) {
  pool
    .query('Select x.* from document_category x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentCategory.getAllDocumentCategory = function (callback) {
  pool
    .query('SELECT *  from document_category ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentCategory.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE document_category set IsDeleted=1, DeletedAt=?, DeleterUserId=?  WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

DocumentCategory.updateById = function (id, document_category, callback) {
  document_category.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE document_category SET  ';

  if (document_category.Name) {
    sql += ' Name=?,';
    params.push(document_category.Name);
  }

  if (document_category.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(document_category.UpdatedAt);
  }

  if (document_category.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(document_category.LastModifierUserId);
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

DocumentCategory.findDocumentCategories = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from document_category  where IsDeleted is null ';
  let sql2 = 'SELECT  *  from document_category  where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  sql2 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

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
      return callback(err, null);
    });
};

module.exports = DocumentCategory;
