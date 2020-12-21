'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var SurveyAnswer = function (survey_answer) {
  this.Id = survey_answer.Id;
  this.IsPublished = survey_answer.IsPublished;
  this.IsDeleted = survey_answer.IsDeleted;
  this.CreatorUserId = survey_answer.CreatorUserId;
  this.CreatedAt = survey_answer.CreatedAt;
  this.LastModifierUserId = survey_answer.LastModifierUserId;
  this.UpdatedAt = survey_answer.UpdatedAt;
  this.DeleterUserId = survey_answer.DeleterUserId;
  this.DeletedAt = survey_answer.DeletedAt;

  this.CourseId = survey_answer.CourseId;
  this.SurveyUserId = survey_answer.SurveyUserId;
  this.Answer = survey_answer.Answer;
  this.SurveyQuestionId = survey_answer.SurveyQuestionId;



};

SurveyAnswer.createSurveyAnswer = function (newSurveyAnswer, callback) {
  pool
    .query(
      'INSERT INTO survey_answer (IsPublished,CreatorUserId,CreatedAt,CourseId, SurveyUserId,Answer,SurveyQuestionId ) values (?,?,?,?,?,?,?)',
      [
        newSurveyAnswer.IsPublished || null,
        newSurveyAnswer.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newSurveyAnswer.CourseId,
        newSurveyAnswer.SurveyUserId || null,
        newSurveyAnswer.Answer,
        newSurveyAnswer.SurveyQuestionId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswer.getSurveyAnswerPaged = function (req, callback) {
  let Pagination = require('../survey_answerers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/survey_answers/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from survey_answer ')
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
          'SELECT (SELECT count(*) from survey_answer)  as linecount, b.*  from survey_answer b LIMIT ' +
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

SurveyAnswer.getSurveyAnswerById = function (id, callback) {
  pool
    .query('Select x.* from survey_answer x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswer.getAllSurveyAnswer = function (callback) {
  pool
    .query('SELECT *  from survey_answer ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswer.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM survey_answer WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyAnswer.updateById = function (id, uid, survey_answer, callback) {
  survey_answer.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  survey_answer.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE survey_answer SET  ';

  if (survey_answer.Name) {
    sql += ' Name=?,';
    params.push(survey_answer.Name);
  }

  if (survey_answer.SurveyUserId) {
    sql += ' SurveyUserId=?,';
    params.push(survey_answer.SurveyUserId);
  }

  if (survey_answer.Answer) {
    sql += ' Answer=?,';
    params.push(survey_answer.Answer);
  }

  if (survey_answer.SurveyQuestionId) {
    sql += ' SurveyQuestionId=?,';
    params.push(survey_answer.SurveyQuestionId);
  }

  if (survey_answer.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(survey_answer.UpdatedAt);
  }

  if (survey_answer.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(survey_answer.LastModifierUserId);
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

module.exports = SurveyAnswer;
