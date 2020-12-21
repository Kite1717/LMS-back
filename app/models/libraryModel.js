'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Library = function (library) {
  this.Id = library.Id;
  this.IsPublished = library.IsPublished;
  this.IsDeleted = library.IsDeleted;
  this.CreatorUserId = library.CreatorUserId;
  this.CreatedAt = library.CreatedAt;
  this.LastModifierUserId = library.LastModifierUserId;
  this.UpdatedAt = library.UpdatedAt;
  this.DeleterUserId = library.DeleterUserId;
  this.DeletedAt = library.DeletedAt;
  this.Code = library.Code;
  this.StartDay = library.StartDay;
  this.EndDay = library.EndDay;
  this.File = library.File;
  this.CourseId = library.CourseId;
};

Library.createLibrary = function (newLibrary, callback) {
  pool
    .query(
      'INSERT INTO library (IsPublished,CreatorUserId,CreatedAt,Code,StartDay,EndDay, File,CourseId ) values (?,?,?,?,?,?,?,?)',
      [
        newLibrary.IsPublished || null,
        newLibrary.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newLibrary.Code,
        moment().format('YYYY-MM-DD'),
        moment().add(365, 'days').format('YYYY-MM-DD'),
        newLibrary.File || null,
        newLibrary.CourseId,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Library.createLibrary -> err', err);
      return callback(err, null);
    });
};

Library.createLibraryLibraryCategory = function (
  libraryId,
  libraryCategoryId,
  callback
) {
  pool
    .query(
      'INSERT INTO library_library_category (LibraryId, LibraryCategoryId ) values (?,?)',
      [libraryId, libraryCategoryId]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Library.createLibrary -> err', err);
      return callback(err, null);
    });
};

Library.getLibraryPaged = function (req, callback) {
  let Pagination = require('../libraryers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/librarys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from library ')
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
          'SELECT (SELECT count(*) from library)  as linecount, b.*  from library b LIMIT ' +
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

Library.getLibraryById = function (id, callback) {
  pool
    .query('Select x.* from library x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Library.getAllLibrary = function (callback) {
  pool
    .query('SELECT *  from library where  IsDeleted is null  ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Library.remove = function (id, callback) {
  console.log('Library.remove -> id', id);
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query('UPDATE library SET IsDeleted = 1, DeletedAt=?  WHERE Id = ?', [
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

Library.updateById = function (id, uid, library, callback) {
  library.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  library.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE library SET  ';

  if (library.Code) {
    sql += ' Code=?,';
    params.push(library.Code);
  }

  if (library.StartDay) {
    sql += ' StartDay=?,';
    params.push(library.StartDay);
  }

  if (library.EndDay) {
    sql += ' EndDay=?,';
    params.push(library.EndDay);
  }

  if (library.File) {
    sql += ' File=?,';
    params.push(library.File);
  }

  if (library.LibraryCategoryId) {
    sql += ' LibraryCategoryId=?';
    params.push(library.LibraryCategoryId);
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

Library.findLibrary = function (queryParams, callback) {
  console.log('Library.findLibrary -> queryParams', queryParams);
  let sql =
    ' SELECT count(l.Id) as totalCount FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE  l.IsDeleted is null ';
  let sql2 =
    ' SELECT l.*,lc.Id as CategoryId FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE  l.IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Code || queryParams.filter.Code != '') {
    let Code = '%' + queryParams.filter.Code + '%';
    sql += ' and l.Code like ? ';
    params.push(Code);

    sql2 += ' and l.Code like ? ';
    params2.push(Code);
  }

  if (queryParams.filter.CourseId || queryParams.filter.CourseId != '') {
    sql += ' and l.CourseId = ? ';
    params.push(queryParams.filter.CourseId);

    sql2 += ' and l.CourseId = ? ';
    params2.push(queryParams.filter.CourseId);
  }

  if (queryParams.filter.CategoryId || queryParams.filter.CategoryId != '') {
    sql += ' and lc.Id = ? ';
    params.push(queryParams.filter.CategoryId);

    sql2 += ' and lc.Id = ? ';
    params2.push(queryParams.filter.CategoryId);
  }

  sql2 += ' order by code asc limit ?,?';
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
      console.log('Library.findLibrary -> err', err);
      return callback(err, null);
    });
};

Library.getLibraryByCourseId = function (id, callback) {
  pool
    .query(
      'Select x.Id,x.File from library x where CourseId = ? and IsDeleted is null',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Library.getLibraryByCourseIdCatyegoryId = function (
  categoryid,
  courseid,
  callback
) {
  pool
    .query(
      'SELECT l.* FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE  l.IsDeleted is NULL AND llc.LibraryCategoryId = ? && l.CourseId = ?',
      [categoryid, courseid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Library;
