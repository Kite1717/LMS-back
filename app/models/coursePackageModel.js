'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CoursePackage = function (course_package) {
  this.Id = course_package.Id;
  this.IsPublished = course_package.IsPublished;
  this.IsDeleted = course_package.IsDeleted;
  this.CreatorUserId = course_package.CreatorUserId;
  this.CreatedAt = course_package.CreatedAt;
  this.LastModifierUserId = course_package.LastModifierUserId;
  this.UpdatedAt = course_package.UpdatedAt;
  this.DeleterUserId = course_package.DeleterUserId;
  this.DeletedAt = course_package.DeletedAt;
  this.Name = course_package.Name;
};

CoursePackage.createCoursePackage = function (newCoursePackage, callback) {
  pool
    .query(
      'INSERT INTO course_package (IsPublished,CreatorUserId,CreatedAt, Name) values (?,?,?,?)',
      [
        newCoursePackage.IsPublished || null,
        newCoursePackage.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCoursePackage.Name,
      ]
    )
    .then((res) => {
      newCoursePackage.Id = res.insertId;
      return callback(null, newCoursePackage);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackage.getCoursePackagePaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/course_packages/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from course_package ')
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
          'SELECT (SELECT count(*) from course_package)  as linecount, b.*  from course_package b LIMIT ' +
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

CoursePackage.getCoursePackageById = function (id, callback) {
  pool
    .query('Select x.* from course_package x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackage.getAllCoursePackage = function (callback) {
  pool
    .query('SELECT *  from course_package where IsDeleted is null')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackage.remove = function (id, uid, callback) {
  let deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course_package SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackage.updateById = function (id, course_package, callback) {
  course_package.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  course_package.LastModifierUserId = course_package.LastModifierUserId;

  const params = [];

  let sql = 'UPDATE course_package SET  ';

  if (course_package.Name) {
    sql += ' Name=?,';
    params.push(course_package.Name);
  }

  if (course_package.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(course_package.UpdatedAt);
  }

  if (course_package.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(course_package.LastModifierUserId);
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

CoursePackage.findCoursePackage = function (
  role,
  companyid,
  queryParams,
  callback
) {
  //console.log('role', role);

  let sql =
    'SELECT  COUNT(Id) as totalCount  from course_package where IsDeleted is null ';
  let sql2 = 'SELECT  *  from course_package where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  /*

  if (role != 1) {
    sql += ' and CompanyId = ?';
    params.push(companyid);

    sql2 += ' and CompanyId = ?';
    params2.push(companyid);
  }

  */

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

module.exports = CoursePackage;
