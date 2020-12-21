'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CourseSection = function (course_section) {
  this.Id = course_section.Id;
  this.IsPublished = course_section.IsPublished;
  this.IsDeleted = course_section.IsDeleted;
  this.CreatorUserId = course_section.CreatorUserId;
  this.CreatedAt = course_section.CreatedAt;
  this.LastModifierUserId = course_section.LastModifierUserId;
  this.UpdatedAt = course_section.UpdatedAt;
  this.DeleterUserId = course_section.DeleterUserId;
  this.DeletedAt = course_section.DeletedAt;
  this.TopicId = course_section.TopicId;
  this.Name = course_section.Name;
  this.FileOrUrl = course_section.FileOrUrl;
  this.CourseTypeId = course_section.CourseTypeId;
  this.CourseType = course_section.CourseType;
};

CourseSection.createCourseSection = function (newCourseSection, callback) {
  pool
    .query(
      'INSERT INTO course_section (IsPublished,CreatorUserId,CreatedAt,TopicId, Name, FileOrUrl, CourseTypeId,CourseType) values (?,?,?,?,?,?,?,?)',
      [
        newCourseSection.IsPublished || null,
        newCourseSection.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCourseSection.TopicId,
        newCourseSection.Name || null,
        newCourseSection.FileOrUrl || null,
        newCourseSection.CourseTypeId || null,
        newCourseSection.CourseType || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseSection.getCourseSectionPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/course_sections/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from course_section ')
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
          'SELECT (SELECT count(*) from course_section)  as linecount, b.*  from course_section b LIMIT ' +
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

CourseSection.getCourseSectionById = function (id, callback) {
  pool
    .query('Select x.* from course_section x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseSection.getAllCourseSection = function (callback) {
  pool
    .query('SELECT *  from course_section ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseSection.findCourseSection = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(course_section.Id) as totalCount  from course_section inner join course_type on course_section.CourseType = course_type.Id where   course_section.IsDeleted is null ';
  let sql2 =
    'SELECT  course_section.*,course_type.Title  from course_section  inner join course_type on course_section.CourseType = course_type.Id  where IsDeleted is null  ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and course_section.Name like ?';
    params.push(Name);

    sql2 += ' and course_section.Name like ?';
    params2.push(Name);
  }

  if (queryParams.filter.TopicId || queryParams.filter.TopicId != '') {
    sql += ' and course_section.TopicId = ?';
    params.push(queryParams.filter.TopicId);

    sql2 += ' and course_section.TopicId = ?';
    params2.push(queryParams.filter.TopicId);
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

CourseSection.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course_section SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseSection.updateById = function (id, course_section, callback) {
  course_section.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE course_section SET  ';

  if (course_section.TopicId) {
    sql += ' TopicId=?,';
    params.push(course_section.TopicId);
  }

  if (course_section.Name) {
    sql += ' Name=?,';
    params.push(course_section.Name);
  }

  if (course_section.FileOrUrl) {
    sql += ' FileOrUrl=?,';
    params.push(course_section.FileOrUrl);
  }

  if (course_section.CourseTypeId) {
    sql += ' CourseTypeId=?,';
    params.push(course_section.CourseTypeId);
  }

  if (course_section.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(course_section.UpdatedAt);
  }

  if (course_section.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(course_section.LastModifierUserId);
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

CourseSection.getCourseSectionByTopicId = function (id, r, callback) {
  pool
    .query(
      'Select x.* from course_section x where TopicId = ? and IsDeleted is null ',
      id
    )
    .then((res) => {
      r.gs = res;

      return callback(null, r);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = CourseSection;
