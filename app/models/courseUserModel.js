'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CourseUser = function (course_user) {
  this.Id = course_user.Id;
  this.IsPublished = course_user.IsPublished;
  this.IsDeleted = course_user.IsDeleted;
  this.CreatorUserId = course_user.CreatorUserId;
  this.CreatedAt = course_user.CreatedAt;
  this.LastModifierUserId = course_user.LastModifierUserId;
  this.UpdatedAt = course_user.UpdatedAt;
  this.DeleterUserId = course_user.DeleterUserId;
  this.DeletedAt = course_user.DeletedAt;
  this.CourseId = course_user.CourseId;
  this.UserId = course_user.UserId;
  this.StartDate = course_user.StartDate;
  this.EndDate = course_user.EndDate;
  this.Begined = course_user.Begined;
  this.Finised = course_user.Finised;
};

CourseUser.createCourseUser = function (newCourseUser, callback) {
  pool
    .query(
      'INSERT INTO course_user (IsPublished,CreatorUserId,CreatedAt,CourseId, UserId, StartDate, EndDate,Begined,Finised) values (?,?,?,?,?,?,?,?,?)',
      [
        newCourseUser.IsPublished || null,
        newCourseUser.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCourseUser.CourseId,
        newCourseUser.UserId || null,
        newCourseUser.StartDate || null,
        newCourseUser.EndDate || null,
        newCourseUser.Begined || null,
        newCourseUser.Finised || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.getCourseUserPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/course_users/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from course_user ')
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
          'SELECT (SELECT count(*) from course_user)  as linecount, b.*  from course_user b LIMIT ' +
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

CourseUser.getCourseUserById = function (id, callback) {
  pool
    .query('Select x.* from course_user x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.getAllCourseUser = function (callback) {
  pool
    .query('SELECT *  from course_user ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.getCourseUserByUserId = function (id, callback) {
  pool
    .query(
      'Select e.Name, e.Id from course_user uc INNER JOIN course e  ON uc.CourseId =e.Id  where uc.UserId = ? and uc.EndDate  >= DATE(NOW())',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.getUserAllCourse = function (id, callback) {
  pool
    .query(
      "SELECT distinct  e.Name, e.Id, (uc.EndDate  >= DATE(NOW()) and uc.Finised is null)  AS 'Available',uc.Begined,uc.Finised   from course_user uc INNER JOIN course e  ON uc.CourseId =e.Id  where uc.UserId = ? and uc.IsDeleted is null",
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM course_user WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CourseUser.updateById = function (id, uid, course_user, callback) {
  course_user.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  course_user.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE course_user SET  ';

  if (course_user.ToCourseIdpicId) {
    sql += ' CourseId=?,';
    params.push(course_user.CourseId);
  }

  if (course_user.UserId) {
    sql += ' UserId=?,';
    params.push(course_user.UserId);
  }

  if (course_user.StartDate) {
    sql += ' StartDate=?,';
    params.push(course_user.StartDate);
  }

  if (course_user.EndDate) {
    sql += ' EndDate=?,';
    params.push(course_user.EndDate);
  }

  if (course_user.Begined) {
    sql += ' Begined=?,';
    params.push(course_user.Begined);
  }

  if (course_user.Finised) {
    sql += ' Finised=?,';
    params.push(course_user.Finised);
  }

  if (course_user.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(course_user.UpdatedAt);
  }

  if (course_user.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(course_user.LastModifierUserId);
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

CourseUser.updateByCourseUserId = function (
  id,
  uid,
  begined,
  finished,
  callback
) {
  UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE course_user SET  ';

  

  if (finished === 1) {
    sql += ' Finised=NOW(),';
  
   
  }

  
  if (begined === 1) {
    sql += ' Begined=NOW(),';
  
   
  }

 
    sql += ' UpdatedAt=?,';
    params.push(UpdatedAt);
  

  if (uid) {
    sql += ' LastModifierUserId=? ';
    params.push(uid);
  }

  params.push(id);
  params.push(uid);

  if(begined === 1)
  { pool
    .query(sql + '  WHERE CourseId = ? and IsDeleted is null and UserId = ? and Begined is null', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });

  }
  else{

    pool
    .query(sql + '  WHERE CourseId = ? and IsDeleted is null and UserId = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    })

  }
 
};

CourseUser.getUsersByUserCourseId = function (id,companyid, callback) {
  
  if(companyid !== 0)
  {

    pool
    .query(
      "SELECT distinct concat(u.FirstName  , ' ' , u.LastName, ' ', date(u.CreatedAt)) AS NAME , u.Id from course_user uc INNER JOIN user u  ON uc.UserId  =u.Id  where uc.CourseId =? and  uc.IsDeleted is null and u.UserStatusId = 1 and u.CompanyId = ?",
     [ id,companyid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });


  }
  else{

    pool
    .query(
      "SELECT distinct concat(u.FirstName  , ' ' , u.LastName, ' ', date(u.CreatedAt)) AS NAME , u.Id from course_user uc INNER JOIN user u  ON uc.UserId  =u.Id  where uc.CourseId =? and  uc.IsDeleted is null and u.UserStatusId = 1 and u.CompanyId != 0",
     [ id,companyid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });

  }
 
};

CourseUser.removeByCourseIdUserId = function (cid, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course_user set IsDeleted = true,DeletedAt=?, DeleterUserId=? WHERE CourseId = ? and UserId = ? and Finised is null',
      [deletedAt, uid, cid, uid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = CourseUser;
