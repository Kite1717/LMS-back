'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CoursePackage = require('./coursePackageModel');

var Course = function (course) {
  this.Id = course.Id;
  this.IsPublished = course.IsPublished;
  this.IsDeleted = course.IsDeleted;
  this.CreatorUserId = course.CreatorUserId;
  this.CreatedAt = course.CreatedAt;
  this.LastModifierUserId = course.LastModifierUserId;
  this.UpdatedAt = course.UpdatedAt;
  this.DeleterUserId = course.DeleterUserId;
  this.DeletedAt = course.DeletedAt;

  this.Name = course.Name;
  this.Description = course.Description;
  this.Duration = course.Duration;
  this.Price = course.Price;
  this.CoursePackageId = course.CoursePackageId;
};

Course.createCourse = function (newCourse, callback) {
  pool
    .query(
      'INSERT INTO course (IsPublished,CreatorUserId,CreatedAt, Name,Description,Duration,Price,CoursePackageId ) values (?,?,?,?,?,?,?,?)',
      [
        newCourse.IsPublished || null,
        newCourse.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCourse.Name,
        newCourse.Description || null,
        newCourse.Duration || null,
        newCourse.Price || null,
        newCourse.CoursePackageId || null,
      ]
    )
    .then((res) => {
      CoursePackage.getCoursePackageById(newCourse.CoursePackageId, function (
        err,
        result
      ) {
        const regex = /(<([^>]+)>)/gi;
        newCourse.CoursePackageName = result[0].Name;
        newCourse.Descr = newCourse.Description.replace(regex, '');
        newCourse.Id = res.insertId;
        return callback(null, newCourse);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Course.findCourse = function (queryParams, callback) {
  let sql =
    ' SELECT   COUNT( course.Id) as totalCount  from course inner join course_package on course.CoursePackageId = course_package.Id LEFT JOIN exam e ON course.Id = e.CourseId  LEFT JOIN library l ON (course.Id = l.CourseId  and  l.IsDeleted is null)  where course.IsDeleted is NULL';
  let sql2 =
    ' SELECT DISTINCT  count(distinct l.file) AS FileCount, course.*,course_package.Name as CoursePackageName, fnStripTags(course.Description) as Descr , e.ExamTypeId from course inner join course_package on course.CoursePackageId = course_package.Id LEFT JOIN exam e ON course.Id = e.CourseId  LEFT JOIN library l ON (course.Id = l.CourseId  and  l.IsDeleted is null)  where course.IsDeleted is NULL   ';

  
  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    // sql += ' and course.Name like ? ';
    // params.push(Name);

    sql2 += 'and  course.Name like ? ';
    params2.push(Name);
  }

  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    let Description = '%' + queryParams.filter.Description + '%';
    sql += ' and course.Description like ? ';
    params.push(Description);

    sql2 += ' and course.Description   like  ? ';
    params2.push(Description);
  }

  sql += '  GROUP BY course.Id ';

  sql2 += '  GROUP BY course.Id ';

  sql2 += ' order by course.Name limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  pool
    .query(sql, params)
    .then((res) => {
 
      pool.query(sql2, params2).then((res) => {

      
        for(let i = 0 ; i< res.length ; i ++)
        {
          res[i].ExamTypeId = 1
        }
        let data = {
          entities: res,
          totalCount: res.length,
        };
        return callback(null, data);
      });
    })
    .catch((err) => {
      console.log('Course.findCourse -> err', err);
      return callback(err, null);
    });
};

Course.getCoursePaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/courses/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from course ')
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
          'SELECT (SELECT count(*) from course)  as linecount, b.*  from course b LIMIT ' +
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

Course.getCourseById = function (id, callback) {
  pool
    .query('Select x.* from course x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Course.getAllCourse = function (callback) {
  pool
    .query('SELECT *  from course  where IsDeleted is null ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Course.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Course.updateById = function (id, course, callback) {
  course.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE course SET  ';

  if (course.Name) {
    sql += ' Name=?,';
    params.push(course.Name);
  }

  if (course.Description) {
    sql += ' Description=?,';
    params.push(course.Description);
  }

  if (course.Duration) {
    sql += ' Duration=?,';
    params.push(course.Duration);
  }

  if (course.Price) {
    sql += ' Price=?,';
    params.push(course.Price);
  }

  if (course.CoursePackageId) {
    sql += ' CoursePackageId=?,';
    params.push(course.CoursePackageId);
  }

  if (course.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(course.UpdatedAt);
  }

  if (course.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(course.LastModifierUserId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      CoursePackage.getCoursePackageById(course.CoursePackageId, function (
        err,
        result
      ) {
        const regex = /(<([^>]+)>)/gi;
        course.CoursePackageName = result[0].Name;
        course.Descr = course.Description.replace(regex, '');
        return callback(null, course);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Course;
