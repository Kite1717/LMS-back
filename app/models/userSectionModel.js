'user strict';
var pool = require('./db.js').pool;
const enums = require('../user_sectioners/enums');
var moment = require('moment');

var UserSection = function (user_section) {
  this.Id = user_section.Id;
  this.IsPublished = user_section.IsPublished;
  this.IsDeleted = user_section.IsDeleted;
  this.CreatorUserId = user_section.CreatorUserId;
  this.CreatedAt = user_section.CreatedAt;
  this.LastModifierUserId = user_section.LastModifierUserId;
  this.UpdatedAt = user_section.UpdatedAt;
  this.DeleterUserId = user_section.DeleterUserId;
  this.DeletedAt = user_section.DeletedAt;

  this.CourseSectionId = user_section.CourseSectionId;
  this.UserId = user_section.UserId;
  this.Begined = user_section.Begined;
  this.Finised = user_section.Finised;
  this.Completed = user_section.Completed;
};

this.createUserSection = function (newUserSection, uid, callback) {
  pool
    .query(
      'INSERT INTO user_section (IsPublished,CreatorUserId,CourseSectionId, UserId,Begined,Finised,Completed ) values (?,?,?,?)',
      [
        newUserSection.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newUserSection.CourseSectionId,
        newUserSection.UserId || null,
        newUserSection.Begined || null,
        newUserSection.Finised || null,
        newUserSection.Completed || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserSection.getUserSectionPaged = function (req, callback) {
  let Pagination = require('../user_sectioners/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/user_sections/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from user_section ')
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
          'SELECT (SELECT count(*) from user_section)  as linecount, b.*  from user_section b LIMIT ' +
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

UserSection.getUserSectionById = function (id, callback) {
  pool
    .query('Select x.* from user_section x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserSection.getAllUserSection = function (callback) {
  pool
    .query('SELECT *  from user_section ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserSection.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM user_section WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserSection.updateById = function (id, uid, user_section, callback) {
  user_section.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  user_section.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE user_section SET  ';

  if (user_section.CourseSectionId) {
    sql += ' CourseSectionId=?,';
    params.push(user_section.CourseSectionId);
  }

  if (user_section.UserId) {
    sql += ' UserId=?,';
    params.push(user_section.UserId);
  }

  if (user_section.Begined) {
    sql += ' Begined=?,';
    params.push(user_section.Begined);
  }

  if (user_section.Finised) {
    sql += ' Finised=?,';
    params.push(user_section.Finised);
  }

  if (user_section.Completed) {
    sql += ' Completed=?,';
    params.push(user_section.Completed);
  }

  if (user_section.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(user_section.UpdatedAt);
  }

  if (user_section.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(user_section.LastModifierUserId);
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

module.exports = UserSection;
