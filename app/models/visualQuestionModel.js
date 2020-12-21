'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

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
  this.Name = question.Name;
  this.Duration = question.Duration;
  this.TopicId = question.TopicId;
  this.CompanyId = question.CompanyId;
  this.LibraryId = question.LibraryId;
  this.LibraryId2 = question.LibraryId2;
  this.SiyahBeyaz = question.SiyahBeyaz;
  this.Organic = question.Organic;
  this.NonOrganic = question.NonOrganic;
  this.Green = question.Green;
  this.TruePlaceToClick = question.TruePlaceToClick;
  this.QuestionType = question.QuestionType;
  this.IsThreatExists = question.IsThreatExists;
  this.A = question.A;
  this.AText = question.AText;
  this.B = question.B;
  this.BText = question.BText;
  this.C = question.C;
  this.CText = question.CText;
  this.D = question.D;
  this.DText = question.DText;
};

Question.createQuestion = function (newQuestion, callback) {
  pool
    .query(
      'INSERT INTO visual_question (IsPublished,CreatorUserId,CreatedAt,Duration,Name, TopicId,CompanyId, LibraryId,LibraryId2,SiyahBeyaz,Organic,NonOrganic,Green,TruePlaceToClick,QuestionType,IsThreatExists,A,AText,B,BText,C,CText,D,DText ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        newQuestion.IsPublished || null,
        newQuestion.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newQuestion.Duration,
        newQuestion.Name,
        newQuestion.TopicId || null,
        newQuestion.CompanyId || null,
        newQuestion.LibraryId || null,
        newQuestion.LibraryId2 || null,
        newQuestion.SiyahBeyaz || null,
        newQuestion.Organic || null,
        newQuestion.NonOrganic || null,
        newQuestion.Green || null,
        newQuestion.TruePlaceToClick || null,
        newQuestion.QuestionType || null,
        newQuestion.IsThreatExists || null,
        newQuestion.A || null,
        newQuestion.AText || null,
        newQuestion.B || null,
        newQuestion.BText || null,
        newQuestion.C || null,
        newQuestion.CText || null,
        newQuestion.D || null,
        newQuestion.DText || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Question.createQuestion -> err', err);
      return callback(err, null);
    });
};

Question.getQuestionPaged = function (req, callback) {
  let Pagination = require('../questioners/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/questions/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from visual_question ')
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
          'SELECT (SELECT count(*) from visual_question)  as linecount, b.*  from visual_question b LIMIT ' +
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
    .query('Select x.* from visual_question x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.getAllQuestion = function (callback) {
  pool
    .query('SELECT *  from visual_question ')
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
      'UPDATE visual_question SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.updateById = function (id, uid, question, callback) {
  question.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  question.LastModifierUserId = uid;

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

  if (question.LibraryId) {
    sql += ' LibraryId=?,';
    params.push(question.LibraryId);
  }

  if (question.LibraryId2) {
    sql += ' LibraryId2=?,';
    params.push(question.LibraryId2);
  }

  if (question.SiyahBeyaz) {
    sql += ' SiyahBeyaz=?,';
    params.pu;
    sh(question.SiyahBeyaz);
  }

  if (question.Organic) {
    sql += ' Organic=?,';
    params.push(question.Organic);
  }

  if (question.NonOrganic) {
    sql += ' NonOrganic=?,';
    params.push(question.NonOrganic);
  }

  if (question.Green) {
    sql += ' Green=?,';
    params.push(question.Green);
  }

  if (question.TruePlaceToClick) {
    sql += ' TruePlaceToClick=?,';
    params.push(question.TruePlaceToClick);
  }

  if (question.QuestionCompletionTimeInMinutes) {
    sql += ' QuestionCompletionTimeInMinutes=?,';
    params.push(question.QuestionCompletionTimeInMinutes);
  }

  if (question.LibraryId) {
    sql += ' LibraryId=?,';
    params.push(question.LibraryId);
  }

  if (question.IsThreatExists) {
    sql += ' IsThreatExists=?,';
    params.push(question.IsThreatExists);
  }

  if (question.IsSectionEndQuestion) {
    sql += ' IsSectionEndQuestion=?,';
    params.push(question.IsSectionEndQuestion);
  }

  if (question.IsRead) {
    sql += ' IsRead=?,';
    params.push(question.IsRead);
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

Question.findQuestions = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(visual_question.Id) as totalCount  from visual_question inner join topic on visual_question.TopicId = topic.Id  where visual_question.IsDeleted is null ';
  let sql2 =
    'SELECT  visual_question.*, topic.Name as TopicName   from visual_question  inner join topic on visual_question.TopicId = topic.Id   where visual_question.IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
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

Question.getAllQuestionAsTag = function (topicId, callback) {
  pool
    .query(
      'SELECT c.id , c.Name AS name  from visual_question c WHERE TopicId = ? AND c.IsDeleted IS null',
      [topicId]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Question.getQuestionByCourseId = function (queryParams, callback) {
  let sql =
    'SELECT count(x.Id) FROM  visual_question x WHERE x.TopicId in (select Id from topic where CourseId=?) AND x.IsDeleted  ';
  let sql2 =
    'SELECT * FROM  visual_question x WHERE x.TopicId in (select Id from topic where CourseId=?) AND x.IsDeleted   ';

  let params = [];
  let params2 = [];

  params.push(queryParams.filter.CourseId);
  params2.push(queryParams.filter.CourseId);

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

Question.getAllQuestionAnswerByExamId = function (id, callback) {
  pool
    .query(
      'SELECT wq.*  from exam_question eq INNER JOIN visual_question wq ON eq.QuestionId = wq.Id   where eq.ExamId=? ORDER BY  eq.Id ',
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
