'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');
var QuestionAnswer = require('./questionAnswerModel');

var Question = function (question) {
  this.Id = question.Id;
  this.IsPublished = question.IsPublished;
  this.IsDeleted = question.IsDeleted;
  this.CreatorUserId = question.CreatorUserId;
  this.CreatedAt = question.CreatedAt;
  this.LastModifierUserId = question.LastModifierUserId;
  this.UpdatedAt = question.UpdatedAt;
  this.DeleterUserId = question.DeleterUserId;
  this.DeletedAt = question.DeletedAt;
  this.Text = question.Text;
  this.TopicId = question.TopicId;
  this.CompanyId = question.CompanyId;
  this.IsSectionEndQuestion = question.IsSectionEndQuestion;
};

Question.createQuestion = function (newQuestion, questionItem, callback) {
  newQuestion.IsSectionEndQuestion = newQuestion.IsSectionEndQuestion ? 1 : 0;
  pool
    .query(
      'INSERT INTO question (IsPublished,CreatorUserId,CreatedAt,Text,TopicId,CompanyId, IsSectionEndQuestion ) values (?,?,?,?,?,?,?)',
      [
        newQuestion.IsPublished || null,
        newQuestion.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newQuestion.Text,
        newQuestion.TopicId || null,
        newQuestion.CompanyId || null,
        newQuestion.IsSectionEndQuestion,
      ]
    )
    .then((res) => {
      var new_question_answer_a = new QuestionAnswer({
        Text: questionItem.question.AText,
        QuestionId: res.insertId,
        CreatorUserId: newQuestion.CreatorUserId,
        CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        IsTrueOption: questionItem.question.A == '1',
      });

      var new_question_answer_b = new QuestionAnswer({
        Text: questionItem.question.BText,
        QuestionId: res.insertId,
        CreatorUserId: newQuestion.CreatorUserId,
        CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        IsTrueOption: questionItem.question.B == '1',
      });

      var new_question_answer_c = new QuestionAnswer({
        Text: questionItem.question.CText,
        QuestionId: res.insertId,
        CreatorUserId: newQuestion.CreatorUserId,
        CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        IsTrueOption: questionItem.question.C == '1',
      });

      var new_question_answer_d = new QuestionAnswer({
        Text: questionItem.question.DText,
        QuestionId: res.insertId,
        CreatorUserId: newQuestion.CreatorUserId,
        CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        IsTrueOption: questionItem.question.D == '1',
      });

      QuestionAnswer.createQuestionAnswer(
       [ new_question_answer_a,
        new_question_answer_b,
        new_question_answer_c,
        new_question_answer_d,],
        function () {}
      ).then(()=>{

        QuestionAnswer.createQuestionAnswer(
          new_question_answer_b,
          function () {}
        ).then(()=>{

          QuestionAnswer.createQuestionAnswer(
            new_question_answer_c,
            function () {}
          ).then(()=>{

            QuestionAnswer.createQuestionAnswer(
              new_question_answer_d,
              function () {}
            ).then(()=>{


            })
      


          })
        })

      });
     
  
    
      newQuestion.Id = res.insertId;
      return callback(null, newQuestion);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.getQuestionPaged = function (req, callback) {
  let Pagination = require('../questioners/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/questions/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from question ')
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
          'SELECT (SELECT count(*) from question)  as linecount, b.*  from question b LIMIT ' +
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

Question.getQuestionById = function (id, callback) {
  pool
    .query('Select x.* from question x where Id = ? ', id)
    .then((res) => {
      QuestionAnswer.getAllQuestionAnswerByQuestionId(res[0].Id, function (
        err,
        ares
      ) {
        const question = {
          Id: res[0].Id,
          AText: ares[0].Text,
          A: ares[0].IsTrueOption ? 1 : 2,
          BText: ares[1].Text,
          B: ares[1].IsTrueOption ? 1 : 2,
          CText: ares[2].Text,
          C: ares[2].IsTrueOption ? 1 : 2,
          DText: ares[3].Text,
          D: ares[3].IsTrueOption ? 1 : 2,
          TopicId: res[0].TopicId,
          IsSectionEndQuestion: res[0].IsSectionEndQuestion ? 1 : 0,
          Text: res[0].Text,
        };
        if (err) return callback(err, null);
        return callback(null, question);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.getAllQuestion = function (callback) {
  pool
    .query('SELECT *  from question ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.getAllQuestionAsTag = function (topicId, callback) {
  pool
    .query('SELECT c.id , c.Text AS name  from question c WHERE TopicId = ? AND c.IsDeleted IS null', [
      topicId,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE question SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.updateById = function (id, question, questionItem, callback) {
  question.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE question SET  ';

  if (question.Text) {
    sql += ' Text=?,';
    params.push(question.Text);
  }

  if (question.TopicId) {
    sql += ' TopicId=?,';
    params.push(question.TopicId);
  }

  if (question.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(question.CompanyId);
  }

  if (question.IsSectionEndQuestion) {
    sql += ' IsSectionEndQuestion=?,';
    params.push(question.IsSectionEndQuestion);
  }

  if (question.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(question.UpdatedAt);
  }

  if (question.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(question.LastModifierUserId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      QuestionAnswer.remove(id, function () {
        var new_question_answer_a = new QuestionAnswer({
          Text: questionItem.AText,
          QuestionId: question.Id,
          CreatorUserId: question.LastModifierUserId,
          CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          IsTrueOption: questionItem.A == '1',
        });

        var new_question_answer_b = new QuestionAnswer({
          Text: questionItem.BText,
          QuestionId: question.Id,
          CreatorUserId: question.LastModifierUserId,
          CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          IsTrueOption: questionItem.B == '1',
        });

        var new_question_answer_c = new QuestionAnswer({
          Text: questionItem.CText,
          QuestionId: question.Id,
          CreatorUserId: question.LastModifierUserId,
          CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          IsTrueOption: questionItem.C == '1',
        });

        var new_question_answer_d = new QuestionAnswer({
          Text: questionItem.DText,
          QuestionId: question.Id,
          CreatorUserId: question.LastModifierUserId,
          CreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          IsTrueOption: questionItem.D == '1',
        });

        QuestionAnswer.createQuestionAnswer(
          new_question_answer_a,
          function () {}
        );
        QuestionAnswer.createQuestionAnswer(
          new_question_answer_b,
          function () {}
        );
        QuestionAnswer.createQuestionAnswer(
          new_question_answer_c,
          function () {}
        );
        QuestionAnswer.createQuestionAnswer(
          new_question_answer_d,
          function () {}
        );

        return callback(null, res);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.findQuestions = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(question.Id) as totalCount  from question inner join topic on question.TopicId = topic.Id  where question.IsDeleted is null ';
  let sql2 =
    'SELECT  question.*, topic.Name as TopicName   from question  inner join topic on question.TopicId = topic.Id   where question.IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Text || queryParams.filter.Text != '') {
    let Text = '%' + queryParams.filter.Text + '%';
    sql += ' and Text like ?';
    params.push(Text);

    sql2 += ' and Text like ?';
    params2.push(Text);
  }

  if (
    queryParams.filter.TopicId &&
    queryParams.filter.TopicId != '' &&
    queryParams.filter.TopicId != 0
  ) {
    sql += ' and TopicId =?';
    params.push(queryParams.filter.TopicId);

    sql2 += ' and TopicId =?';
    params2.push(queryParams.filter.TopicId);
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
      return callback(err, null);
    });
};

Question.getQuestionByCourseId = function (queryParams, callback) {
  let sql =
    'SELECT  vq.Name  as Text FROM visual_question vq INNER JOIN topic t ON t.Id = vq.TopicId WHERE  vq.IsDeleted is NULL AND courseId = ?  ';
  let sql2 =
    'SELECT  q.Text FROM question q INNER JOIN topic t ON t.Id = q.TopicId WHERE  q.IsDeleted is NULL AND courseId = ?  ';

  let params = [];
  let params2 = [];

  params.push(queryParams.filter.CourseId);

  params2.push(queryParams.filter.CourseId);


  console.log(queryParams.page)
  sql += ' limit ?,?';
  sql2 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize ;
  params.push(limit1);
  params.push(limit2);
  params2.push(limit1);
  params2.push(limit2);

 

  pool
    .query(sql, params)
    .then((res) => {
      
      console.log(res, "res")
  


    
      pool.query(sql2, params2).then((res2) => {

      
        Promise.all([
          pool.query("SELECT COUNT(*) as Count  FROM visual_question vq INNER JOIN topic t ON t.Id = vq.TopicId WHERE  vq.IsDeleted is NULL AND courseId = ? ",queryParams.filter.CourseId),
          pool.query("SELECT COUNT(*) as Count  FROM question q INNER JOIN topic t ON t.Id = q.TopicId WHERE  q.IsDeleted is NULL AND courseId = ?   ",queryParams.filter.CourseId)
         
        ]).then(values => {

        
            let data = {
              entities: {
                visual : res,
                visualCount : values[0].length > 0 ?  values[0][0].Count : 0,
                theoric  :res2,
                theoricCount : values[1].length > 0 ?  values[1][0].Count : 0,
              },
              
            };
            return callback(null, data);

       
        });
      

      });
    })
    .catch((err) => {
      console.log('Question.getQuestionByCourseId -> err', err);
      return callback(err, null);
    });
};


Question.getAllQuestionAnswerByExamId = function (id, callback) {
  pool
    .query(
      'SELECT wq.* FROM visual_question wq WHERE  wq.Id IN (SELECT QuestionId FROM exam_question WHERE  ExamId = ?)',
      [id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Question.getAllQuestionAnswerByExamId -> err', err);
      return callback(err, null);
    });
};
module.exports = Question;
