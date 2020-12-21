'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

const ExamStatusIds = enums.ExamStatusIds;

const { v4: uuidv4 } = require('uuid');

var UserExam = function (user_exam) {
  this.Id = user_exam.Id;
  this.IsPublished = user_exam.IsPublished;
  this.IsDeleted = user_exam.IsDeleted;
  this.CreatorUserId = user_exam.CreatorUserId;
  this.CreatedAt = user_exam.CreatedAt;
  this.LastModifierUserId = user_exam.LastModifierUserId;
  this.UpdatedAt = user_exam.UpdatedAt;
  this.DeleterUserId = user_exam.DeleterUserId;
  this.DeletedAt = user_exam.DeletedAt;

  this.ExamCode = user_exam.ExamCode;
  this.ExamStatusId = user_exam.ExamStatusId;
  this.StartDate = user_exam.StartDate;
  this.EndDate = user_exam.EndDate;
  this.Begined = user_exam.Begined;
  this.Finised = user_exam.Finised;
  this.CorrectCount = user_exam.CorrectCount;
  this.WrongCount = user_exam.WrongCount;
  this.UserSuccessRate = user_exam.UserSuccessRate;
  this.MinSuccessRate = user_exam.MinSuccessRate;
  this.RepeatExamCount = user_exam.RepeatExamCount;
  this.ExamId = user_exam.ExamId;
  this.UserId = user_exam.UserId;
};

UserExam.createUserExam = function (newUserExam, callback) {
  console.log('UserExam.createUserExam -> newUserExam', newUserExam);
  pool
    .query(
      'INSERT INTO user_exam (IsPublished,CreatorUserId,CreatedAt,ExamCode,ExamStatusId,StartDate,EndDate,ExamId,UserId,MinSuccessRate ) values (?,?,?,?,?,?,?,?,?,?)',
      [
        newUserExam.IsPublished || null,
        newUserExam.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        uuidv4(),
        newUserExam.ExamStatusId || null,
        newUserExam.StartDate || null,
        newUserExam.EndDate || null,
        newUserExam.ExamId || null,
        newUserExam.UserId || null,
        newUserExam.MinSuccessRate || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.getUserExamPaged = function (req, callback) {
  let Pagination = require('../user_examers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/user_exams/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from user_exam ')
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
          'SELECT (SELECT count(*) from user_exam)  as linecount, b.*  from user_exam b LIMIT ' +
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

/*
UserExam.getUserExamById = function (id, callback) {
  pool
    .query('Select x.* from user_exam x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};
*/

UserExam.getUserExamByExamCode = function (id, callback) {
  pool
    .query(
      'Select x.*, e.ExamTypeId from user_exam x inner join exam e on e.Id = x.ExamId where ExamCode = ? ',
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.getAllUserExam = function (callback) {
  pool
    .query('SELECT *  from user_exam ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM user_exam WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.updateById = function (id, uid, user_exam, callback) {
  user_exam.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  user_exam.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE user_exam SET  ';

  if (user_exam.ExamCode) {
    sql += ' ExamCode=?,';
    params.push(user_exam.ExamCode);
  }

  if (user_exam.ExamStatusId) {
    sql += ' ExamStatusId=?,';
    params.push(user_exam.ExamStatusId);
  }

  if (user_exam.StartDate) {
    sql += ' StartDate=?,';
    params.push(user_exam.StartDate);
  }

  if (user_exam.EndDate) {
    sql += ' EndDate=?,';
    params.push(user_exam.EndDate);
  }

  if (user_exam.Finised) {
    sql += ' Finised=?,';
    params.push(user_exam.Finised);
  }

  if (user_exam.CorrectCount) {
    sql += ' EndDate=?,';
    params.push(user_exam.CorrectCount);
  }

  if (user_exam.WrongCount) {
    sql += ' WrongCount=?,';
    params.push(user_exam.WrongCount);
  }

  if (user_exam.UserSuccessRate) {
    sql += ' UserSuccessRate=?,';
    params.push(user_exam.UserSuccessRate);
  }

  if (user_exam.RepeatExamCount) {
    sql += ' RepeatExamCount=?,';
    params.push(user_exam.RepeatExamCount);
  }

  if (user_exam.ExamId) {
    sql += ' ExamId=?,';
    params.push(user_exam.ExamId);
  }

  if (user_exam.UserId) {
    sql += ' UserId=?,';
    params.push(user_exam.UserId);
  }

  if (user_exam.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(user_exam.UpdatedAt);
  }

  if (user_exam.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(user_exam.LastModifierUserId);
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

UserExam.getUserExamById = function (id, callback) {
  

  let data = []
  pool // exam
    .query(
      'Select e.ExamTypeId, ue.ExamCode, e.Name,ue.EndDate,ue.MinSuccessRate,e.Duration  from user_exam ue INNER JOIN exam e  ON ue.ExamId =e.Id  where ue.UserId = ? and ue.EndDate >= DATE(NOW()) AND examStatusId IS null and e.IsDeleted is null',
      id
    )
    .then((res) => {
      
      pool // meeting 
      .query(
        'Select  e.MeetingName,e.EndTime  from meeting_user ue INNER JOIN meeting  e  ON ue.MeetingId =e.Id  where ue.UserId = ? AND e.EndTime >= DATE(NOW()) AND ue.IsDeleted IS null   AND e.IsDeleted IS null',
        id
      ).then((res2)=>{


        pool // course 
        .query(
          'Select  e.Name ,ue.EndDate  from course_user ue INNER JOIN course  e  ON ue.CourseId =e.Id  where ue.UserId = 130 AND ue.EndDate >= DATE(NOW()) AND ue.IsDeleted IS NULL AND e.IsDeleted IS null ',
          id
        ).then((res3)=>{

          data = [...res,...res2,...res3]
          return callback(null,data)

        })
  
      })

    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.getUsersAllExam = function (id, callback) {


  pool
    .query(
      "Select ue.StartDate,ue.Begined,ue.Finised, ue.ExamId,e.ExamTypeId, ue.ExamCode,ue.UserSuccessRate, e.Name,ue.EndDate,ue.MinSuccessRate,e.Duration ,   ue.EndDate >= DATE(NOW()) AND examStatusId IS NULL AS 'Available'   from user_exam ue INNER JOIN exam e  ON ue.ExamId =e.Id  where ue.UserId = ?   order by  ue.CreatedAt desc ",
      id
    )
    .then((res) => {
      let data = []
      for(let i = 0 ; i < res.length; i++)
      {
        let start = new Date(res[i].StartDate)
        let end = new Date()
       
       
        res[i].AVAAAAA = start - end
       // start.setHours(start.getHours() + 3)
        if(start - end <= 0 && res[i].Begined  === null && res[i].Finised === null)
        data.push(res[i])
        else if(res[i].Begined  !== null || res[i].Finised !== null)
          data.push(res[i])
      }
       

      return callback(null, data);
    })
    .catch((err) => {
      return callback(err, null);
    });
};




UserExam.getUserExamAnswerById = function (id,examId, callback) {
  pool
    .query(
      " SELECT t.name as TopicName,q.Text AS QuestionName ,qa.Text AS UserAnswer,qa.IsTrueOption,c.Name as CourseName  FROM user_exam_answer uer INNER JOIN  question_answer qa ON qa.Id = uer.QuestionAnswersId  INNER JOIN question q ON q.Id = qa.QuestionId  INNER JOIN topic t ON t.Id = q.TopicId  INNER JOIN course c ON c.Id = t.CourseId WHERE  uer.CreatorUserId = ? AND uer.UserExamId = ? AND uer.IsDeleted IS NULL AND  qa.IsDeleted IS NULL and q.IsDeleted IS null and c.IsDeleted IS null",
      [id,examId]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};


UserExam.updateByExamCode = function (id, uid, begined, finished, callback) {
  UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE user_exam SET  ';

  if (begined) {
    sql += ' Begined=?,';
    begined = moment().format('YYYY-MM-DD HH:mm:ss');
    sql += ' ExamStatusId = ' + ExamStatusIds.InProgress + ',';
    params.push(begined);
  }

  if (finished) {
    sql += ' Finised=?,';
    finished = moment().format('YYYY-MM-DD HH:mm:ss');
    sql += ' ExamStatusId = ' + ExamStatusIds.Finished + ',';
    params.push(finished);
  }

  if (UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(UpdatedAt);
  }

  if (uid) {
    sql += ' LastModifierUserId=? ';
    params.push(uid);
  }

  params.push(id);

  console.log('UserExam.updateByExamCode -> sql', sql);

  pool
    .query(sql + '  WHERE ExamCode = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.updateCountsandRatesByExamCode = function (
  id,
  CorrectCount,
  WrongCount,
  UserSuccessRate,
  uid,
  callback
) {
  UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE user_exam SET  ';

  if (CorrectCount !== undefined) {
    sql += ' CorrectCount=?,';
    params.push(CorrectCount);
  }

  if (WrongCount !== undefined) {
    sql += ' WrongCount=?,';
    params.push(WrongCount);
  }

  if (UserSuccessRate !== undefined) {
    sql += ' UserSuccessRate=?,';
    params.push(UserSuccessRate);
  }

  if (UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(UpdatedAt);
  }

  if (uid) {
    sql += ' LastModifierUserId=? ';
    params.push(uid);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE ExamCode = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

//
UserExam.getUserCertificates = function (id, callback) {
 
pool
    .query(
'SELECT DISTINCT concat(UPPER(acronym(cc.Name)),"-",SUBSTRING_INDEX(c.CCode, "-", -1)) as CCode ,c.CreatedAt as Finised ,u.TCNo,u.FirstName,u.LastName,cc.Name,cc.Duration from certificate c   inner join user u ON u.Id =c.UserId  INNER JOIN exam e ON e.Id = c.ExamId  inner JOIN course cc ON cc.Id = e.CourseId  INNER JOIN user_exam ue ON (u.Id = ue.UserId AND ue.ExamId = e.Id) WHERE ue.UserSuccessRate >= ue.MinSuccessRate  and c.IsDeleted is null and ue.IsDeleted is null  and cc.IsDeleted is null and e.IsDeleted is null and u.Id = ?'      
      ,id
    )
    .then((res) => {

      pool.query(
        'SELECT CONCAT(FirstName," ",LastName) AS CompanyAdmin FROM user WHERE UserStatusId = 1 AND  role = 2 and CompanyId = (SELECT CompanyId FROM user WHERE Id = ?) LIMIT 0,1'
         ,
        id
      ).then((res2) =>{

        for(let i = 0 ; i < res.length ;i ++)
        {
          res[i].CompanyAdmin = res2[0].CompanyAdmin
        }
        return callback(null,res)

      }
      
      )

    
     
    })
    .catch((err) => {
      return callback(err, null);
    });
};

UserExam.getUsersByExamId = function (id,companyid, callback) {
  if(companyid !== 0)
  {

    pool
    .query(
      "SELECT distinct concat(u.FirstName  , ' ' , u.LastName) AS NAME , u.Id from user_exam ue INNER JOIN user u  ON ue.UserId  =u.Id  where  ue.IsDeleted is null   and ue.ExamId= ? and u.UserStatusId = 1 and u.CompanyId = ?   order by u.FirstName asc",
      [id,companyid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
  }
  else{
    pool
    .query(
      "SELECT distinct concat(u.FirstName  , ' ' , u.LastName) AS NAME , u.Id from user_exam ue INNER JOIN user u  ON ue.UserId  =u.Id  where  ue.IsDeleted is null and ue.ExamId= ? and u.UserStatusId = 1 and u.CompanyId != 0  order by u.FirstName asc",
      [id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
  }
  
};

UserExam.removeByExamIdUserId = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE user_exam set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE ExamId = ? and   UserId = ?',
      [deletedAt, uid, id, uid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = UserExam;
