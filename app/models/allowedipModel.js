'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var AllowedIp = function (allowedIp) {
  this.Id = allowedIp.Id;
  this.IsPublished = allowedIp.IsPublished;
  this.IsDeleted = allowedIp.IsDeleted;
  this.CreatorUserId = allowedIp.CreatorUserId;
  this.CreatedAt = allowedIp.CreatedAt;
  this.LastModifierUserId = allowedIp.LastModifierUserId;
  this.UpdatedAt = allowedIp.UpdatedAt;
  this.DeleterUserId = allowedIp.DeleterUserId;
  this.DeletedAt = allowedIp.DeletedAt;
  this.CompanyId = allowedIp.CompanyId;
  this.Description = allowedIp.Description;
  this.Ip = allowedIp.Ip;
};

AllowedIp.createAllowedIp = function (newAllowedIp, callback) {
  pool
    .query(
      'INSERT INTO allowed_ip (IsPublished,CreatorUserId,CreatedAt, CompanyId,Description, Ip ) values (?,?,?,?,?,?)',
      [
        newAllowedIp.IsPublished || null,
        newAllowedIp.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newAllowedIp.CompanyId,
        newAllowedIp.Description || null,
        newAllowedIp.Ip,
      ]
    )
    .then((res) => {
     
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

AllowedIp.getAllowedIpPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/allowedIps/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from allowed_ip ')
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
          'SELECT (SELECT count(*) from allowedIp)  as linecount, b.*  from allowedIp b LIMIT ' +
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

AllowedIp.getAllowedIpById = function (id, callback) {
  pool
    .query('Select x.* from allowed_ip x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

AllowedIp.getAllAllowedIp = function (callback) {
  pool
    .query('SELECT *  from allowed_ip ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

AllowedIp.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE allowed_ip SET  IsDeleted = true, DeletedAt=?, DeleterUserId=?   WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

AllowedIp.updateById = function (id, allowedIp, callback) {
  allowedIp.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE allowed_ip SET  ';

  if (allowedIp.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(allowedIp.CompanyId);
  }

  if (allowedIp.Ip) {
    sql += ' Ip=?,';
    params.push(allowedIp.Ip);
  }

  if (allowedIp.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(allowedIp.UpdatedAt);
  }

  if (allowedIp.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(allowedIp.LastModifierUserId);
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

AllowedIp.findAllowedIp = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from allowed_ip where  IsDeleted is null   ';
  let sql2 = 'SELECT  *  from allowed_ip where IsDeleted is null  ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    let Code = '%' + queryParams.filter.Description + '%';
    sql += ' and Description like ?,';
    params.push(Description);

    sql2 += ' and Description like ?,';
    params2.push(Description);
  }

  if (queryParams.filter.Ip || queryParams.filter.Ip != '') {
    let Code = '%' + queryParams.filter.Ip + '%';
    sql += ' and Ip like ?,';
    params.push(Ip);

    sql2 += ' and Ip like ?,';
    params2.push(Ip);
  }

  if (queryParams.filter.CompanyId || queryParams.filter.CompanyId != '') {
    sql += ' and CompanyId = ? ';
    params.push(queryParams.filter.CompanyId);

    sql2 += ' and CompanyId = ? ';
    params2.push(queryParams.filter.CompanyId);
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

module.exports = AllowedIp;
