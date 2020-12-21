'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var UserExamAnswer = function (user_exam_answer) {
  this.Id = user_exam_answer.Id;
  this.IsPublished = user_exam_answer.IsPublished;
  this.IsDeleted = user_exam_answer.IsDeleted;
  this.CreatorUserId = user_exam_answer.CreatorUserId;
  this.CreatedAt = user_exam_answer.CreatedAt;
  this.LastModifierUserId = user_exam_answer.LastModifierUserId;
  this.UpdatedAt = user_exam_answer.UpdatedAt;
  this.DeleterUserId = user_exam_answer.DeleterUserId;
  this.DeletedAt = user_exam_answer.DeletedAt;

  this.UserExamId = user_exam_answer.UserExamId;
  this.QuestionAnswersId = user_exam_answer.QuestionAnswersId;
  this.QuestionId = user_exam_answer.QuestionId;

  this.AnswerId = user_exam_answer.AnswerId;
  this.TruePlaceToClick = user_exam_answer.TruePlaceToClick;
};

UserExamAnswer.createUserExamAnswer = function (newUserExamAnswer, callback) {
  pool
    .query(
      'INSERT INTO user_exam_answer (IsPublished,CreatorUserId, CreatedAt, UserExamId,QuestionAnswersId,QuestionId,AnswerId,TruePlaceToClick  ) values (?,?,?,?,?,?,?,?)',
      [
        newUserExamAnswer.IsPublished || null,
        newUserExamAnswer.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newUserExamAnswer.UserExamId,
        newUserExamAnswer.QuestionAnswersId || null,
        newUserExamAnswer.QuestionId || null,
        newUserExamAnswer.AnswerId || null,
        newUserExamAnswer.TruePlaceToClick || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
     
      return callback(err, null);
    });
};

UserExamAnswer.getUserExamAnswerPaged = function (req, callback) {
  let Pagination = require('../user_exam_answerers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/user_exam_answers/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from user_exam_answer ')
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
          'SELECT (SELECT count(*) from user_exam_answer)  as linecount, b.*  from user_exam_answer b LIMIT ' +
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

UserExamAnswer.getUserExamAnswerById = function (id, callback) {
  pool
    .query('Select x.* from user_exam_answer x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExamAnswer.getAllUserExamAnswer = function (callback) {
  pool
    .query('SELECT *  from user_exam_answer ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExamAnswer.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM user_exam_answer WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExamAnswer.updateById = function (id, uid, user_exam_answer, callback) {
  user_exam_answer.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  user_exam_answer.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE user_exam_answer SET  ';

  if (user_exam_answer.UserExamId) {
    sql += ' UserExamId=?,';
    params.push(user_exam_answer.UserExamId);
  }

  if (user_exam_answer.QuestionAnswersId) {
    sql += ' QuestionAnswersId=?,';
    params.push(user_exam_answer.QuestionAnswersId);
  }

  if (user_exam_answer.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(user_exam_answer.UpdatedAt);
  }

  if (user_exam_answer.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(user_exam_answer.LastModifierUserId);
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

module.exports = UserExamAnswer;
