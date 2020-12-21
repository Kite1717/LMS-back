'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Exam = function (exam) {
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
  this.TopicId = exam.TopicId;
  this.Duration = exam.Duration;
  this.SuccessRate = exam.SuccessRate;
  this.ExamTypeId = exam.ExamTypeId;
};

Exam.createExam = function (newExam, callback) {
  pool
    .query(
      'INSERT INTO exam (IsPublished,CreatorUserId,CreatedAt,CompanyId,Name,Description,CourseId,TopicId, Duration,SuccessRate,ExamTypeId  ) values (?,?,?,?,?,?,?,?,?,?,?)',
      [
        newExam.IsPublished || null,
        newExam.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newExam.CompanyId,
        newExam.Name || null,
        newExam.Description || null,
        newExam.CourseId || null,
        newExam.TopicId || null,
        newExam.Duration || null,
        newExam.SuccessRate || null,
        newExam.ExamTypeId,
      ]
    )
    .then((res) => {
      newExam.Id = res.insertId;
      return callback(null, newExam);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Exam.getExamPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/exams/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from exam ')
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
          'SELECT (SELECT count(*) from exam)  as linecount, b.*  from exam b LIMIT ' +
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

Exam.getExamById = function (id, callback) {
  pool
    .query('Select x.* from exam x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Exam.getAllExam = function (callback) {
  pool
    .query('SELECT *  from exam ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Exam.getExamByExamCode = function (id, callback) {
  pool
    .query(
      'Select * from exam  where Id = (SELECT ExamId FROM user_exam WHERE ExamCode = ?) ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Exam.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE exam set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Exam.updateById = function (id, exam, callback) {
  console.log('Exam.updateById -> exam', exam);
  console.log('Exam.updateById -> id', id);
  exam.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE exam SET  ';

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
    sql += ' LastModifierUserId=?';
    params.push(exam.LastModifierUserId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Exam.updateById -> err', err);
      return callback(err, null);
    });
};

Exam.findExam = function (role, companyid, queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from exam where IsDeleted is null ';
  let sql2 =
    'SELECT  fnStripTags(Description) as Descr, Name, SuccessRate, Duration ,Id  from exam where IsDeleted is null ';

  let params = [];
  let params2 = [];



  

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
   
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  if (queryParams.filter.ExamTypeId || queryParams.filter.ExamTypeId != '') {
    sql += ' and ExamTypeId = ?';
    params.push(queryParams.filter.ExamTypeId);

    sql2 += ' and ExamTypeId = ?';
    params2.push(queryParams.filter.ExamTypeId);
  }

  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    let Description = '%' + queryParams.filter.Description + '%';
    sql += ' and Description like ?';
    params.push(Description);

    sql2 += ' and  Description like ?';
    params2.push(Description);
  }

  if (role !== 1) {
    sql += ' and CompanyId = ?';
    params.push(companyid);

    sql2 += ' and CompanyId = ?';
    params2.push(companyid);
  }

  
  
  // sql2 += ' order by exam.Name limit ?,?';
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
        console.log(data)
        return callback(null, data);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Exam;
