'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Survey = function (survey) {
  this.Id = survey.Id;
  this.IsPublished = survey.IsPublished;
  this.IsDeleted = survey.IsDeleted;
  this.CreatorUserId = survey.CreatorUserId;
  this.CreatedAt = survey.CreatedAt;
  this.LastModifierUserId = survey.LastModifierUserId;
  this.UpdatedAt = survey.UpdatedAt;
  this.DeleterUserId = survey.DeleterUserId;
  this.DeletedAt = survey.DeletedAt;

  this.Name = survey.Name;
  this.CourseId = survey.CourseId;
};

Survey.createSurvey = function (newSurvey, callback) {
  pool
    .query(
      'INSERT INTO survey (IsPublished,CreatorUserId,CreatedAt, Name, CourseId ) values (?,?,?,?,?)',
      [
        newSurvey.IsPublished || null,
        newSurvey.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newSurvey.Name,
        newSurvey.CourseId || null,
      ]
    )
    .then((res) => {
      newSurvey.Id = res.insertId;
      return callback(null, newSurvey);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.getSurveyPaged = function (req, callback) {
  let Pagination = require('../surveyers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/surveys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from survey ')
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
          'SELECT (SELECT count(*) from survey)  as linecount, b.*  from survey b LIMIT ' +
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

Survey.getSurveyById = function (id, callback) {
  pool
    .query('Select x.* from survey x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.getAllSurvey = function (callback) {
  pool
    .query('SELECT *  from survey ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE survey set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.updateById = function (id, survey, callback) {
  survey.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE survey SET  ';

  if (survey.Name) {
    sql += ' Name=?,';
    params.push(survey.Name);
  }

  if (survey.CourseId) {
    sql += ' CourseId=?,';
    params.push(survey.CourseId);
  }

  if (survey.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(survey.UpdatedAt);
  }

  if (survey.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(survey.LastModifierUserId);
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

Survey.getSurveyByCourseId = function (id, callback) {
  pool
    .query(
      'SELECT survey.Id AS SurveyId,survey.Name AS SurveyName,survey_group.Id AS SurveyGroupId,survey_group.Name AS SurveyGroupName,survey_question.Id AS QuestionId,survey_question.Question AS QuestionText FROM survey INNER JOIN survey_group ON survey.Id = survey_group.SurveyId INNER JOIN survey_question ON survey_group.Id = survey_question.SurveyGroupId WHERE survey.CourseId = ?  AND survey.IsDeleted IS NULL AND survey_group.IsDeleted IS NULL AND survey_question.IsDeleted IS NULL ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.getSurveyByUserCourseCode = function (id, callback) {
  pool
    .query(
      'SELECT *  FROM survey s WHERE s.CourseId = ? AND s.IsDeleted IS null',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.getSurveysUserAnswerById = function (id, callback) {
  pool
    .query(
      'SELECT u.Id, u.FirstName, u.LastName,u.TCNo,c.FullName as CompanyName FROM user u INNER JOIN survey_answer sa  ON sa.CreatorUserId = u.Id INNER JOIN company c ON c.Id = u.CompanyId WHERE u.UserStatusId = 1 AND sa.IsDeleted IS NULL AND c.IsDeleted IS NULL AND   sa.CourseId = ?  GROUP BY u.Id  ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};


Survey.getSurveysAllAnswerStattisticByCourseId = function (id, callback) {
  pool
    .query(
      'SELECT sg.Name AS GroupName, sq.Id,sq.Question, sa.Answer FROM survey_answer sa INNER JOIN survey_question sq ON sa.SurveyQuestionId = sq.Id INNER JOIN survey_group sg ON sg.Id = sq.SurveyGroupId WHERE sa.IsDeleted IS NULL AND sa.CourseId = ? AND sq.IsDeleted IS NULL AND sg.IsDeleted IS NULL ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};








Survey.getCourseSurveyAnswersByUserId = function (id,courseId ,callback) {
  pool
    .query(
      'SELECT sq.Id, sa.Answer,sq.Question,sg.Name AS GroupName FROM user u INNER JOIN survey_answer sa ON sa.SurveyUserId = u.Id INNER JOIN survey_question sq ON sq.Id  = sa.SurveyQuestionId INNER JOIN survey_group sg ON sg.Id = sq.SurveyGroupId WHERE u.UserStatusId = 1 AND sa.SurveyUserId = ? and  sa.CourseId = ?  and sa.IsDeleted IS NULL  AND sg.IsDeleted IS NULL AND sq.IsDeleted IS NULL   ORDER BY sq.Id',
      [id,courseId]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Survey.getUserSurveyCommentByUserIdAndCourseId = function (id,courseId ,callback) {
  pool
    .query(
      'SELECT * FROM survey_answer_comment sac WHERE sac.IsDeleted IS NULL AND sac.CourseId = ? AND sac.SurveyUserId = ?',
      [courseId,id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};




Survey.findSurvey = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from survey where  IsDeleted is null   ';
  let sql2 = 'SELECT  *  from survey where IsDeleted is null  ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
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

module.exports = Survey;
