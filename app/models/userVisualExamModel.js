'user strict';
var pool = require('./db.js').pool;
const enums = require('../user_visual_examers/enums');
var moment = require('moment');

var UserVisualExam = function (user_visual_exam) {
  this.Id = user_visual_exam.Id;
  this.IsPublished = user_visual_exam.IsPublished;
  this.IsDeleted = user_visual_exam.IsDeleted;
  this.CreatorUserId = user_visual_exam.CreatorUserId;
  this.CreatedAt = user_visual_exam.CreatedAt;
  this.LastModifierUserId = user_visual_exam.LastModifierUserId;
  this.UpdatedAt = user_visual_exam.UpdatedAt;
  this.DeleterUserId = user_visual_exam.DeleterUserId;
  this.DeletedAt = user_visual_exam.DeletedAt;

  this.ExamCode = user_visual_exam.ExamCode;
  this.ExamStatusId = user_visual_exam.ExamStatusId;
  this.StartDate = user_visual_exam.StartDate;
  this.EndDate = user_visual_exam.EndDate;
  this.Begined = user_visual_exam.Begined;
  this.Finised = user_visual_exam.Finised;
  this.CorrectCount = user_visual_exam.CorrectCount;
  this.WrongCount = user_visual_exam.WrongCount;
  this.UserSuccessRate = user_visual_exam.UserSuccessRate;
  this.MinSuccessRate = user_visual_exam.MinSuccessRate;
  this.RepeatExamCount = user_visual_exam.RepeatExamCount;
  this.ExamId = user_visual_exam.ExamId;
  this.UserId = user_visual_exam.UserId;
};

this.createUserVisualExam = function (newUserVisualExam, uid, callback) {
  pool
    .query(
      'INSERT INTO user_visual_exam (IsPublished,CreatorUserId,ExamCode,ExamStatusId,StartDate,EndDate,Begined,Finised,CorrectCount,WrongCount,UserSuccessRate,RepeatExamCount,ExamId,UserId ) values (?,?,?,?)',
      [
        newUserVisualExam.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newUserVisualExam.ExamCode,
        newUserVisualExam.ExamStatusId || null,
        newUserVisualExam.StartDate || null,
        newUserVisualExam.EndDate || null,
        newUserVisualExam.Begined || null,
        newUserVisualExam.Finised || null,
        newUserVisualExam.CorrectCount || null,
        newUserVisualExam.WrongCount || null,
        newUserVisualExam.UserSuccessRate || null,
        newUserVisualExam.RepeatExamCount || null,
        newUserVisualExam.ExamId || null,
        newUserVisualExam.UserId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExam.getUserVisualExamPaged = function (req, callback) {
  let Pagination = require('../user_visual_examers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/user_visual_exams/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from user_visual_exam ')
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
          'SELECT (SELECT count(*) from user_visual_exam)  as linecount, b.*  from user_visual_exam b LIMIT ' +
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

UserVisualExam.getUserVisualExamById = function (id, callback) {
  pool
    .query('Select x.* from user_visual_exam x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExam.getAllUserVisualExam = function (callback) {
  pool
    .query('SELECT *  from user_visual_exam ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExam.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM user_visual_exam WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExam.updateById = function (id, uid, user_visual_exam, callback) {
  user_visual_exam.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  user_visual_exam.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE user_visual_exam SET  ';

  if (user_visual_exam.ExamCode) {
    sql += ' ExamCode=?,';
    params.push(user_visual_exam.ExamCode);
  }

  if (user_visual_exam.ExamStatusId) {
    sql += ' ExamStatusId=?,';
    params.push(user_visual_exam.ExamStatusId);
  }

  if (user_visual_exam.StartDate) {
    sql += ' StartDate=?,';
    params.push(user_visual_exam.StartDate);
  }

  if (user_visual_exam.EndDate) {
    sql += ' EndDate=?,';
    params.push(user_visual_exam.EndDate);
  }

  if (user_visual_exam.Finised) {
    sql += ' Finised=?,';
    params.push(user_visual_exam.Finised);
  }

  if (user_visual_exam.CorrectCount) {
    sql += ' EndDate=?,';
    params.push(user_visual_exam.CorrectCount);
  }

  if (user_visual_exam.WrongCount) {
    sql += ' WrongCount=?,';
    params.push(user_visual_exam.WrongCount);
  }

  if (user_visual_exam.UserSuccessRate) {
    sql += ' UserSuccessRate=?,';
    params.push(user_visual_exam.UserSuccessRate);
  }

  if (user_visual_exam.RepeatExamCount) {
    sql += ' RepeatExamCount=?,';
    params.push(user_visual_exam.RepeatExamCount);
  }

  if (user_visual_exam.ExamId) {
    sql += ' ExamId=?,';
    params.push(user_visual_exam.ExamId);
  }

  if (user_visual_exam.UserId) {
    sql += ' UserId=?,';
    params.push(user_visual_exam.UserId);
  }

  if (user_visual_exam.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(user_visual_exam.UpdatedAt);
  }

  if (user_visual_exam.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(user_visual_exam.LastModifierUserId);
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

module.exports = UserVisualExam;
