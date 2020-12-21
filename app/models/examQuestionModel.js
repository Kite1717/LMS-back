'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var ExamQuestion = function (exam_question) {
  this.Id = exam_question.Id;
  this.IsPublished = exam_question.IsPublished;
  this.IsDeleted = exam_question.IsDeleted;
  this.CreatorUserId = exam_question.CreatorUserId;
  this.CreatedAt = exam_question.CreatedAt;
  this.LastModifierUserId = exam_question.LastModifierUserId;
  this.UpdatedAt = exam_question.UpdatedAt;
  this.DeleterUserId = exam_question.DeleterUserId;
  this.DeletedAt = exam_question.DeletedAt;
  this.ExamId = exam_question.ExamId;
  this.QuestionId = exam_question.QuestionId;
  this.VisualQuestionId = exam_question.VisualQuestionId;
};

ExamQuestion.createExamQuestion =  async function ( questionList, callback) {

  
  // pool
  //   .query(
  //     'INSERT INTO exam_question (IsPublished,CreatorUserId,CreatedAt,ExamId,QuestionId,VisualQuestionId  ) values (?,?,?,?,?,?)',
  //     [
  //       newExamQuestion.IsPublished || null,
  //       newExamQuestion.CreatorUserId,
  //       moment().format('YYYY-MM-DD HH:mm:ss'),
  //       newExamQuestion.ExamId,
  //       newExamQuestion.QuestionId || null,
  //       newExamQuestion.VisualQuestionId || null,
  //     ]
  //   )


  //   .then((res) => {
  //     return callback(null, res);
  //   })
  //   .catch((err) => {
  //     return callback(err, null);
  //   });


    
    try{
      for(let i  = 0 ; i<questionList.length ; i++)
      {
      await  pool.query('INSERT INTO exam_question (IsPublished,CreatorUserId,CreatedAt,ExamId,QuestionId,VisualQuestionId  ) values (?,?,?,?,?,?)'
      ,[
        questionList[i].IsPublished || null,
        questionList[i].CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        questionList[i].ExamId,
        questionList[i].QuestionId || null,
        questionList[i].VisualQuestionId || null,
      ])
      }
  
    }
    finally {
  
    
     // eslint-disable-next-line no-unsafe-finally
     return callback(null,data);
    }
};

ExamQuestion.getExamQuestionPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/exam_questions/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from exam_question ')
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
          'SELECT (SELECT count(*) from exam_question)  as linecount, b.*  from exam_question b LIMIT ' +
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

ExamQuestion.getExamQuestionById = function (id, callback) {
  pool
    .query('Select x.* from exam_question x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ExamQuestion.getExamQuestionByExamId = function (id, callback) {
  pool
    .query(
      'SELECT q.Text, q.Id, qa.Text AS answer, qa.Id AS AnswerId from exam_question eq LEFT JOIN question  q ON  eq.QuestionId = q.Id LEFT JOIN question_answer qa ON  q.Id = qa.QuestionId where eq.ExamId = (SELECT ExamId FROM user_exam WHERE ExamCode = ?) order by eq.Id ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ExamQuestion.getVisualExamQuestionByExamId = function (id, callback) {
  pool
    .query(
      ' SELECT q.Duration,q.Id,q.Name,q.LibraryId,	q.LibraryId2,	q.SiyahBeyaz,	q.Organic,	q.NonOrganic,	q.Green,	q.TruePlaceToClick,	q.IsThreatExists,	q.QuestionType,	q.A,	q.AText,	q.B,	q.BText,	q.C,	q.CText,	q.D,	q.DText FROM exam_question eq LEFT JOIN visual_question q ON  eq.QuestionId = q.Id  where eq.ExamId   = (SELECT ExamId FROM user_exam WHERE ExamCode= ?) order by eq.Id',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ExamQuestion.getAllExamQuestion = function (callback) {
  pool
    .query('SELECT *  from exam_question ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ExamQuestion.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM exam_question WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ExamQuestion.updateById = function (id, uid, exam_question, callback) {
  exam_question.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  exam_question.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE exam_question SET  ';

  if (exam_question.ExamId) {
    sql += ' ExamId=?,';
    params.push(exam_question.ExamId);
  }

  if (exam_question.QuestionId) {
    sql += ' QuestionId=?,';
    params.push(exam_question.QuestionId);
  }

  if (exam_question.VisualQuestionId) {
    sql += ' VisualQuestionId=?,';
    params.push(exam_question.VisualQuestionId);
  }

  if (exam_question.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(exam_question.UpdatedAt);
  }

  if (exam_question.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(exam_question.LastModifierUserId);
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

ExamQuestion.getExamQuestionsByExamId = function (id, callback) {
  pool
    .query(
      'SELECT q.*  from exam_question eq INNER JOIN question q ON eq.QuestionId = q.Id   where eq.ExamId=? order by eq.Id',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = ExamQuestion;
