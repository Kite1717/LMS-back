'user strict';
var pool = require('./db.js').pool;
const enums = require('../user_exam_answerers/enums');
var moment = require('moment');

var UserVisualExamAnswer = function (user_exam_answer) {
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
  this.VisualQuestionAnswersId = user_exam_answer.VisualQuestionAnswersId;
};

this.createUserVisualExamAnswer = function (
  newUserVisualExamAnswer,
  uid,
  callback
) {
  pool
    .query(
      'INSERT INTO user_exam_answer (IsPublished,CreatorUserId,UserExamId,VisualQuestionAnswersId  ) values (?,?,?,?)',
      [
        newUserVisualExamAnswer.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newUserVisualExamAnswer.UserExamId,
        newUserVisualExamAnswer.VisualQuestionAnswersId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExamAnswer.getUserVisualExamAnswerPaged = function (req, callback) {
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

UserVisualExamAnswer.getUserVisualExamAnswerById = function (id, callback) {
  pool
    .query('Select x.* from user_exam_answer x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExamAnswer.getAllUserVisualExamAnswer = function (callback) {
  pool
    .query('SELECT *  from user_exam_answer ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserVisualExamAnswer.remove = function (id, uid, callback) {
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

UserVisualExamAnswer.updateById = function (
  id,
  uid,
  user_exam_answer,
  callback
) {
  user_exam_answer.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  user_exam_answer.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE user_exam_answer SET  ';

  if (user_exam_answer.UserExamId) {
    sql += ' UserExamId=?,';
    params.push(user_exam_answer.UserExamId);
  }

  if (user_exam_answer.VisualQuestionAnswersId) {
    sql += ' VisualQuestionAnswersId=?,';
    params.push(user_exam_answer.VisualQuestionAnswersId);
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

module.exports = UserVisualExamAnswer;
