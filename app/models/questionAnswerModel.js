'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var QuestionAnswer = function (question_answer) {
  this.Id = question_answer.Id;
  this.IsPublished = question_answer.IsPublished;
  this.IsDeleted = question_answer.IsDeleted;
  this.CreatorUserId = question_answer.CreatorUserId;
  this.CreatedAt = question_answer.CreatedAt;
  this.LastModifierUserId = question_answer.LastModifierUserId;
  this.UpdatedAt = question_answer.UpdatedAt;
  this.DeleterUserId = question_answer.DeleterUserId;
  this.DeletedAt = question_answer.DeletedAt;
  this.Text = question_answer.Text;
  this.QuestionId = question_answer.QuestionId;
  this.IsTrueOption = question_answer.IsTrueOption;
};

QuestionAnswer.createQuestionAnswer = async function (answers, callback) {


  for(let i = 0 ; i  < answers.length;i ++)
  {
    await pool.query('INSERT INTO question_answer (IsPublished,CreatorUserId,CreatedAt,Text,QuestionId,IsTrueOption ) values (?,?,?,?,?,?)'
    
    ,[
      answers[i].IsPublished || null,
      answers[i].CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        answers[i].Text,
        answers[i].QuestionId || null,
        answers[i].IsTrueOption || null,

    ])  .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
  }
  // pool
  //   .query(
  //     'INSERT INTO question_answer (IsPublished,CreatorUserId,CreatedAt,Text,QuestionId,IsTrueOption ) values (?,?,?,?,?,?)',
  //     [
  //       newQuestionAnswer.IsPublished || null,
  //       newQuestionAnswer.CreatorUserId,
  //       moment().format('YYYY-MM-DD HH:mm:ss'),
  //       newQuestionAnswer.Text,
  //       newQuestionAnswer.QuestionId || null,
  //       newQuestionAnswer.IsTrueOption || null,
  //     ]
  //   )
  //   .then((res) => {
  //     return callback(null, res);
  //   })
  //   .catch((err) => {
  //     return callback(err, null);
  //   });


    
};

QuestionAnswer.getQuestionAnswerPaged = function (req, callback) {
  let Pagination = require('../question_answerers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/question_answers/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from question_answer ')
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
          'SELECT (SELECT count(*) from question_answer)  as linecount, b.*  from question_answer b LIMIT ' +
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

QuestionAnswer.getQuestionAnswerById = function (id, callback) {
  pool
    .query('Select x.* from question_answer x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

QuestionAnswer.getAllQuestionAnswerByQuestionId = function (id, callback) {
  pool
    .query('Select x.* from question_answer x where x.QuestionId = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

QuestionAnswer.getAllQuestionAnswer = function (callback) {
  pool
    .query('SELECT *  from question_answer ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

QuestionAnswer.getAllQuestionAnswerByExamId = function (id, callback) {
  pool
    .query(
      'SELECT qa.* FROM question_answer qa WHERE  qa.QuestionId IN (SELECT QuestionId FROM exam_question WHERE IsTrueOption = 1 and ExamId = ?)',
      [id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

QuestionAnswer.remove = function (id, callback) {
  pool
    .query('DELETE from question_answer WHERE QuestionId = ?', [id])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

QuestionAnswer.updateById = function (id, uid, question_answer, callback) {
  question_answer.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  question_answer.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE question_answer SET  ';

  if (question_answer.Text) {
    sql += ' Text=?,';
    params.push(question_answer.Text);
  }

  if (question_answer.QuestionId) {
    sql += ' TopicId=?,';
    params.push(question_answer.QuestionId);
  }

  if (question_answer.IsTrueOption) {
    sql += ' CompanyId=?,';
    params.push(question_answer.IsTrueOption);
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

module.exports = QuestionAnswer;
