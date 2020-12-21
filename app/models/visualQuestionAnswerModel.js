'user strict';
var pool = require('./db.js').pool;
const enums = require('../visual_question_answerers/enums');
var moment = require('moment');

var VisualQuestionAnswer = function (visual_question_answer) {
  this.Id = visual_question_answer.Id;
  this.IsPublished = visual_question_answer.IsPublished;
  this.IsDeleted = visual_question_answer.IsDeleted;
  this.CreatorUserId = visual_question_answer.CreatorUserId;
  this.CreatedAt = visual_question_answer.CreatedAt;
  this.LastModifierUserId = visual_question_answer.LastModifierUserId;
  this.UpdatedAt = visual_question_answer.UpdatedAt;
  this.DeleterUserId = visual_question_answer.DeleterUserId;
  this.DeletedAt = visual_question_answer.DeletedAt;

  this.VisualQuestionId = visual_question_answer.VisualQuestionId;
  this.Text = visual_question_answer.Text;
  this.SelectedLocation = visual_question_answer.SelectedLocation;
  this.QuestionHasSecondAnswer = visual_question_answer.QuestionHasSecondAnswer;
  this.IsClickedLocationTrue = visual_question_answer.IsClickedLocationTrue;
  this.AnswerTimePassed = visual_question_answer.AnswerTimePassed;
};

VisualQuestionAnswer.createVisualQuestionAnswer = function (
  newVisualQuestionAnswer,
  uid,
  callback
) {
  pool
    .query(
      'INSERT INTO visual_question_answer (IsPublished,CreatorUserId,CreatedAt,VisualQuestionId, Text, SelectedLocation, QuestionHasSecondAnswer, IsClickedLocationTrue,AnswerTimePassed ) values (?,?,?,?,?,?,?)',
      [
        newVisualQuestionAnswer.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newVisualQuestionAnswer.VisualQuestionId,
        newVisualQuestionAnswer.Text || null,
        newVisualQuestionAnswer.SelectedLocation || null,
        newVisualQuestionAnswer.QuestionHasSecondAnswer,
        newVisualQuestionAnswer.IsClickedLocationTrue || null,
        newVisualQuestionAnswer.AnswerTimePassed || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualQuestionAnswer.getVisualQuestionAnswerPaged = function (req, callback) {
  let Pagination = require('../visual_question_answerers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/visual_question_answers/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from visual_question_answer ')
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
          'SELECT (SELECT count(*) from visual_question_answer)  as linecount, b.*  from visual_question_answer b LIMIT ' +
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

VisualQuestionAnswer.getVisualQuestionAnswerById = function (id, callback) {
  pool
    .query('Select x.* from visual_question_answer x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualQuestionAnswer.getAllVisualQuestionAnswer = function (callback) {
  pool
    .query('SELECT *  from visual_question_answer ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualQuestionAnswer.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM visual_question_answer WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualQuestionAnswer.updateById = function (
  id,
  uid,
  visual_question_answer,
  callback
) {
  visual_question_answer.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  visual_question_answer.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE visual_question_answer SET  ';

  if (visual_question_answer.VisualQuestionId) {
    sql += ' VisualQuestionId=?,';
    params.push(visual_question_answer.VisualQuestionId);
  }

  if (visual_question_answer.Text) {
    sql += ' Text=?,';
    params.push(visual_question_answer.Text);
  }

  if (visual_question_answer.SelectedLocation) {
    sql += ' SelectedLocation=?,';
    params.push(visual_question_answer.SelectedLocation);
  }

  if (visual_question_answer.QuestionHasSecondAnswer) {
    sql += ' QuestionHasSecondAnswer=?,';
    params.push(visual_question_answer.QuestionHasSecondAnswer);
  }

  if (visual_question_answer.IsClickedLocationTrue) {
    sql += ' IsClickedLocationTrue=?,';
    params.push(visual_question_answer.IsClickedLocationTrue);
  }

  if (visual_question_answer.AnswerTimePassed) {
    sql += ' AnswerTimePassed=?,';
    params.push(visual_question_answer.AnswerTimePassed);
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

module.exports = VisualQuestionAnswer;
