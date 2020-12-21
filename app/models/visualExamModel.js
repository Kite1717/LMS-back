'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var VisualExam = function (exam) {
  this.Id = exam.Id;
  this.IsPublished = exam.IsPublished;
  this.IsDeleted = exam.IsDeleted;
  this.CreatorUserId = exam.CreatorUserId;
  this.CreatedAt = exam.CreatedAt;
  this.LastModifierUserId = exam.LastModifierUserId;
  this.UpdatedAt = exam.UpdatedAt;
  this.DeleterUserId = exam.DeleterUserId;
  this.DeletedAt = exam.DeletedAt;
  this.CompanyId = exam.CompanyId;
  this.Name = exam.Name;
  this.Description = exam.Description;
  this.CourseId = exam.CourseId;
  this.Duration = exam.Duration;
  this.SuccessRate = exam.SuccessRate;
};

VisualExam.createVisualExam = function (newVisualExam, callback) {
  pool
    .query(
      'INSERT INTO visual_exam (IsPublished,CreatorUserId,CreatedAt,CompanyId,Name,Description,CourseId, Duration,SuccessRate  ) values (?,?,?,?,?,?,?,?,?)',
      [
        newVisualExam.IsPublished || null,
        newVisualExam.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newVisualExam.CompanyId,
        newVisualExam.Name || null,
        newVisualExam.Description || null,
        newVisualExam.CourseId || null,
        newVisualExam.Duration || null,
        newVisualExam.SuccessRate || null,
      ]
    )
    .then((res) => {
      newVisualExam.Id = res.insertId;
      return callback(null, newVisualExam);
    })
    .catch((err) => {
      console.log('VisualExam.createVisualExam -> err', err);
      return callback(err, null);
    });
};

VisualExam.getVisualExamPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/exams/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from visual_exam ')
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
          'SELECT (SELECT count(*) from visual_exam)  as linecount, b.*  from visual_exam b LIMIT ' +
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

VisualExam.getVisualExamById = function (id, callback) {
  pool
    .query('Select x.* from visual_exam x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};



VisualExam.answersOfVisualExam = function (id,examId, callback) {
  pool
    .query('SELECT t.Name as TopicName,q.Name AS QuestionName , uer.TruePlaceToClick ,c.Name as CourseName  FROM user_exam_answer uer INNER JOIN  visual_question q ON q.Id = uer.QuestionId  inner join topic t on t.Id = q.TopicId INNER JOIN course c ON c.Id = t.CourseId WHERE  uer.CreatorUserId = ? AND uer.UserExamId = ? AND uer.IsDeleted IS NULL AND   q.IsDeleted IS null  AND c.IsDeleted IS null ', [id,examId])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualExam.getAllVisualExam = function (callback) {
  pool
    .query('SELECT *  from visual_exam ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualExam.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM visual_exam WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

VisualExam.updateById = function (id, uid, exam, callback) {
  exam.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  exam.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE visual_exam SET  ';

  if (exam.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(exam.CompanyId);
  }

  if (exam.Name) {
    sql += ' Name=?,';
    params.push(exam.Name);
  }

  if (exam.Description) {
    sql += ' Description=?,';
    params.push(exam.Description);
  }

  if (exam.CourseId) {
    sql += ' CourseId=?,';
    params.push(exam.CourseId);
  }

  if (exam.Duration) {
    sql += ' Duration=?,';
    params.push(exam.Duration);
  }

  if (exam.SuccessRate) {
    sql += ' SuccessRate=?,';
    params.push(exam.SuccessRate);
  }

  if (exam.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(exam.UpdatedAt);
  }

  if (exam.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(exam.LastModifierUserId);
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

VisualExam.findExam = function (role, companyid, queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from visual_exam where IsDeleted is null ';
  let sql2 = 'SELECT  *  from visual_exam where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    let Description = '%' + queryParams.filter.Description + '%';
    sql += ' and Description like ?';
    params.push(Name);

    sql2 += ' and Description like ?';
    params2.push(Description);
  }

  if (role != 1) {
    sql += ' and CompanyId = ?';
    params.push(companyid);

    sql2 += ' and CompanyId = ?';
    params2.push(companyid);
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

module.exports = VisualExam;
