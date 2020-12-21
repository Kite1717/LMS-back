'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var SurveyQuestion = function (survey_question) {
  this.Id = survey_question.Id;
  this.IsPublished = survey_question.IsPublished;
  this.IsDeleted = survey_question.IsDeleted;
  this.CreatorUserId = survey_question.CreatorUserId;
  this.CreatedAt = survey_question.CreatedAt;
  this.LastModifierUserId = survey_question.LastModifierUserId;
  this.UpdatedAt = survey_question.UpdatedAt;
  this.DeleterUserId = survey_question.DeleterUserId;
  this.DeletedAt = survey_question.DeletedAt;

  this.Question = survey_question.Question;
  this.SurveyGroupId = survey_question.SurveyGroupId;
};

SurveyQuestion.createSurveyQuestion = function (
  newSurveyQuestion,

  callback
) {
  pool
    .query(
      'INSERT INTO survey_question (IsPublished,CreatorUserId,CreatedAt,Question, SurveyGroupId ) values (?,?,?,?,?)',
      [
        newSurveyQuestion.IsPublished || null,
        newSurveyQuestion.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newSurveyQuestion.Question,
        newSurveyQuestion.SurveyGroupId || null,
      ]
    )
    .then((res) => {
      newSurveyQuestion.Id = res.insertId;
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyQuestion.getSurveyQuestionPaged = function (req, callback) {
  let Pagination = require('../survey_questioners/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/survey_questions/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from survey_question ')
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
          'SELECT (SELECT count(*) from survey_question)  as linecount, b.*  from survey_question b LIMIT ' +
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

SurveyQuestion.getSurveyQuestionById = function (id, callback) {
  pool
    .query('Select x.* from survey_question x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyQuestion.getAllSurveyQuestion = function (callback) {
  pool
    .query('SELECT *  from survey_question ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyQuestion.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE survey_question set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyQuestion.updateById = function (id, survey_question, callback) {
  survey_question.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE survey_question SET  ';

  if (survey_question.Question) {
    sql += ' Question=?,';
    params.push(survey_question.Question);
  }

  if (survey_question.SurveyGroupId) {
    sql += ' SurveyGroupId=?,';
    params.push(survey_question.SurveyGroupId);
  }

  if (survey_question.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(survey_question.UpdatedAt);
  }

  if (survey_question.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(survey_question.LastModifierUserId);
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

SurveyQuestion.getSurveyGroupByPollId = function (id, callback) {
  console.log('SurveyQuestion.getSurveyGroupByPollId -> id', id);
  pool
    .query('Select x.* from survey_group x where SurveyGroupId = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyQuestion.findSurveyQuestion = function (queryParams, callback) {
  console.log('SurveyQuestion.findSurveyQuestion -> queryParams', queryParams);
  let sql =
    'SELECT  COUNT(Id) as totalCount  from survey_question where  IsDeleted is null   ';
  let sql2 = 'SELECT  *  from survey_question where IsDeleted is null  ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Question || queryParams.filter.Question != '') {
    let Question = '%' + queryParams.filter.Question + '%';
    sql += ' and Question like ?';
    params.push(Question);

    sql2 += ' and Question like ?';
    params2.push(Question);
  }

  if (
    queryParams.filter.SurveyGroupId != undefined &&
    queryParams.filter.SurveyGroupId != ''
  ) {
    sql += ' and SurveyGroupId = ?';
    params.push(queryParams.filter.SurveyGroupId);

    sql2 += ' and SurveyGroupId = ?';
    params2.push(queryParams.filter.SurveyGroupId);
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
      console.log('Library.findLibrary -> err', err);
      return callback(err, null);
    });
};

module.exports = SurveyQuestion;
