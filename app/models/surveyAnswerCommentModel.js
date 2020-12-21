'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var SurveyAnswerComment = function (survey_answer_comment) {
  this.Id = survey_answer_comment.Id;
  this.IsPublished = survey_answer_comment.IsPublished;
  this.IsDeleted = survey_answer_comment.IsDeleted;
  this.CreatorUserId = survey_answer_comment.CreatorUserId;
  this.CreatedAt = survey_answer_comment.CreatedAt;
  this.LastModifierUserId = survey_answer_comment.LastModifierUserId;
  this.UpdatedAt = survey_answer_comment.UpdatedAt;
  this.DeleterUserId = survey_answer_comment.DeleterUserId;
  this.DeletedAt = survey_answer_comment.DeletedAt;

  this.CourseId = survey_answer_comment.CourseId;
  this.SurveyUserId = survey_answer_comment.SurveyUserId;
  this.Comment = survey_answer_comment.Comment;
};

SurveyAnswerComment.createSurveyAnswerComment = function (
  newSurveyAnswerComment,
  callback
) {
  pool
    .query(
      'INSERT INTO survey_answer_comment (IsPublished,CreatorUserId,CreatedAt,CourseId, SurveyUserId,Comment ) values (?,?,?,?,?,?)',
      [
        newSurveyAnswerComment.IsPublished || null,
        newSurveyAnswerComment.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newSurveyAnswerComment.CourseId,
        newSurveyAnswerComment.SurveyUserId || null,
        newSurveyAnswerComment.Comment,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswerComment.getSurveyAnswerCommentPaged = function (req, callback) {
  let Pagination = require('../survey_answer_commenters/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/survey_answer_comments/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from survey_answer_comment ')
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
          'SELECT (SELECT count(*) from survey_answer_comment)  as linecount, b.*  from survey_answer_comment b LIMIT ' +
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

SurveyAnswerComment.getSurveyAnswerCommentById = function (id, callback) {
  pool
    .query('Select x.* from survey_answer_comment x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswerComment.getAllSurveyAnswerComment = function (callback) {
  pool
    .query('SELECT *  from survey_answer_comment ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswerComment.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM survey_answer_comment WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswerComment.updateById = function (
  id,
  uid,
  survey_answer_comment,
  callback
) {
  survey_answer_comment.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  survey_answer_comment.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE survey_answer_comment SET  ';

  if (survey_answer_comment.Name) {
    sql += ' Name=?,';
    params.push(survey_answer_comment.Name);
  }

  if (survey_answer_comment.SurveyUserId) {
    sql += ' SurveyUserId=?,';
    params.push(survey_answer_comment.SurveyUserId);
  }

  if (survey_answer_comment.AnswerComment) {
    sql += ' AnswerComment=?,';
    params.push(survey_answer_comment.AnswerComment);
  }

  if (survey_answer_comment.SurveyQuestionId) {
    sql += ' SurveyQuestionId=?,';
    params.push(survey_answer_comment.SurveyQuestionId);
  }

  if (survey_answer_comment.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(survey_answer_comment.UpdatedAt);
  }

  if (survey_answer_comment.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(survey_answer_comment.LastModifierUserId);
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

module.exports = SurveyAnswerComment;
