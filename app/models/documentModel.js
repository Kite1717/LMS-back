'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Document = function (document) {
  this.Id = document.Id;
  this.IsPublished = document.IsPublished;
  this.IsDeleted = document.IsDeleted;
  this.CreatorUserId = document.CreatorUserId;
  this.CreatedAt = document.CreatedAt;
  this.LastModifierUserId = document.LastModifierUserId;
  this.UpdatedAt = document.UpdatedAt;
  this.DeleterUserId = document.DeleterUserId;
  this.DeletedAt = document.DeletedAt;
  this.CompanyId = document.CompanyId;
  this.File = document.File;
  this.DocumentSubCategoryId = document.DocumentSubCategoryId;
  this.DocumentName = document.DocumentName;
};

Document.createDocument = function (newDocument, callback) {
  pool
    .query(
      'INSERT INTO document (IsPublished,CreatorUserId,CreatedAt,CompanyId, File, DocumentSubCategoryId,DocumentName) values (?,?,?,?,?,?,?)',
      [
        newDocument.IsPublished || null,
        newDocument.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newDocument.CompanyId,
        newDocument.File || null,
        newDocument.DocumentSubCategoryId || null,
        newDocument.DocumentName,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Document.getDocumentPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/documents/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from document ')
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
          'SELECT (SELECT count(*) from document)  as linecount, b.*  from document b LIMIT ' +
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

Document.getDocumentById = function (id, callback) {
  pool
    .query('Select x.* from document x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Document.getAllDocument = function (callback) {
  pool
    .query('SELECT *  from document ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Document.remove = function (id, callback) {
  console.log('Document.remove -> id', id);
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query('UPDATE document SET IsDeleted = 1, DeletedAt=?  WHERE Id = ?', [
      deletedAt,
      id,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Document.updateById = function (id, uid, document, callback) {
  document.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  document.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE document SET  ';

  if (document.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(document.CompanyId);
  }

  if (document.DocumentTypeId) {
    sql += ' DocumentTypeId=?,';
    params.push(document.DocumentTypeId);
  }

  if (document.File) {
    sql += ' File=?,';
    params.push(document.File);
  }

  if (document.DocumentSubCategoryId) {
    sql += ' DocumentSubCategoryId=?,';
    params.push(document.DocumentSubCategoryId);
  }

  if (document.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(document.UpdatedAt);
  }

  if (document.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(document.LastModifierUserId);
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

Document.findDocument = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(*) as totalCount  from document inner join document_sub_category dsc on document.DocumentSubCategoryId = dsc.Id  where document.IsDeleted is null ';
  let sql2 =
    'SELECT  document.*, dsc.Name  from document inner join document_sub_category dsc on document.DocumentSubCategoryId = dsc.Id  where document.IsDeleted is null ';

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
    queryParams.filter.CompanyId &&
    queryParams.filter.CompanyId != '' &&
    queryParams.filter.CompanyId != 0
  ) {
    sql += ' and CompanyId =?';
    params.push(queryParams.filter.CompanyId);

    sql2 += ' and CompanyId =?';
    params2.push(queryParams.filter.CompanyId);
  }

  if (queryParams.filter.QualityDocumentSubjectId) {
    sql += ' and DocumentSubCategoryId =?';
    params.push(queryParams.filter.QualityDocumentSubjectId);

    sql2 += ' and DocumentSubCategoryId =?';
    params2.push(queryParams.filter.QualityDocumentSubjectId);
  }

  sql2 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  console.log('Document.findDocument -> sql', sql);

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

module.exports = Document;
