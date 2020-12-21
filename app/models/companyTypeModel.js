'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CompanyType = function (company_typeType) {
  this.Id = company_typeType.Id;
  this.IsPublished = company_typeType.IsPublished;
  this.IsDeleted = company_typeType.IsDeleted;
  this.CreatorUserId = company_typeType.CreatorUserId;
  this.CreatedAt = company_typeType.CreatedAt;
  this.LastModifierUserId = company_typeType.LastModifierUserId;
  this.UpdatedAt = company_typeType.UpdatedAt;
  this.DeleterUserId = company_typeType.DeleterUserId;
  this.DeletedAt = company_typeType.DeletedAt;
  this.Name = company_typeType.Name;
};

CompanyType.createCompanyType = function (newCompanyType, uid, callback) {
  pool
    .query(
      'INSERT INTO company_type (IsPublished,CreatorallowedIpId,CreatedAt, Name ) values (?,?,?,?)',
      [
        newCompanyType.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCompanyType.Name,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CompanyType.getCompanyTypePaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/company_types/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from company_type ')
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
          'SELECT (SELECT count(*) from company_type)  as linecount, b.*  from company_type b LIMIT ' +
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

CompanyType.getCompanyTypeById = function (id, callback) {
  pool
    .query('Select x.* from company_type x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CompanyType.getAllCompanyType = function (callback) {
  pool
    .query('SELECT *  from company_type ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CompanyType.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM company_type WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CompanyType.updateById = function (id, uid, company_type, callback) {
  company_type.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  company_type.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE company_type SET  ';

  if (company_type.Name) {
    sql += ' Name=?,';
    params.push(company_type.Name);
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

module.exports = CompanyType;
