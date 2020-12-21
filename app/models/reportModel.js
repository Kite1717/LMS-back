'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Report = function (report) {
  this.Id = report.Id;
  this.CompanyId = report.CompanyId;
};

Report.totalUserCount = function (companyId, callback) {
  let sql = 'SELECT COUNT(*) AS TotalUser  FROM user WHERE CompanyId <> 0 AND userStatusId = 1';
 
  let params = [];

  if (companyId || companyId != 0) {
    sql += ' GROUP BY CompanyId HAVING CompanyId = ?';
    params.push(companyId);
  }

  pool
    .query(sql, params)
    .then((res) => {
     
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};


Report.ExamSuccessRateById = function (id, callback) {
  let params = [];
 
  let sql =
    '  SELECT UserSuccessRate ,Finised FROM user_exam WHERE UserId = ? AND UserSuccessRate IS NOT NULL ';
    params.push(id)
  


  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};



Report.VeryEasyVisualQuestions = function ( callback) {

 
  let sql =
    'SELECT uer.TruePlaceToClick ,vq.Name FROM user_exam_answer  uer INNER JOIN  exam  e ON e.Id = uer.UserExamId INNER JOIN visual_question vq ON vq.Id = uer.QuestionId  WHERE e.IsDeleted IS NULL AND uer.IsDeleted IS NULL AND e.ExamTypeId = 2 AND vq.IsDeleted IS NULL';
  pool
    .query(sql)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.theorical_question_count_by_course = function (companyId, callback) {
  let params = [];
 
  let sql =
    'SELECT c.Name, COUNT(q.Id) AS Total FROM  question q INNER JOIN topic t ON   (q.TopicId = t.Id and q.IsDeleted is null) INNER JOIN course c ON t.CourseId = c.Id  where c.IsDeleted is null GROUP BY CourseId order by c.Name';


  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.visual_question_count_by_course = function (companyId, callback) {
  let sql =
    'SELECT c.Name, COUNT(q.Id) AS Total FROM  visual_question q INNER JOIN topic t ON  (q.TopicId = t.Id and q.IsDeleted is null) INNER JOIN course c ON t.CourseId = c.Id where c.IsDeleted is null GROUP BY CourseId';

  let params = [];

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.total_library_count_by_course_category = function (companyId, callback) {
  let sql =
    'SELECT c.name AS CourseName,  lc.Name AS LibraryCategoryName,  (l.Id) AS Total FROM library l INNER JOIN course c ON l.CourseId = c.Id INNER JOIN library_library_category llc ON l.Id = llc.LibraryId INNER JOIN library_category lc ON llc.LibraryCategoryId = lc.Id     GROUP BY llc.LibraryCategoryId, lc.Id, lc.Name, c.Id, C.Name';

  let params = [];

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.total_library_count_by_course_category = function (companyId, callback) {
  let sql =
    'SELECT c.name AS CourseName,  lc.Name AS LibraryCategoryName,  (l.Id) AS Total FROM library l INNER JOIN course c ON l.CourseId = c.Id INNER JOIN library_library_category llc ON l.Id = llc.LibraryId INNER JOIN library_category lc ON llc.LibraryCategoryId = lc.Id     GROUP BY llc.LibraryCategoryId, lc.Id, lc.Name, c.Id, C.Name';

  let params = [];

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.motnhly_created_library = function (companyId, callback) {
  let sql =
    "SELECT DATE_FORMAT(Date(CreatedAt),'%d.%m.%Y')  AS CreatedDate , COUNT(*) AS Count FROM library GROUP BY Date(CreatedAt) ORDER BY  Date(CreatedAt)";

  let params = [];

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.total_created_certificates = function (companyId, role, callback) {
  let sql =

  'SELECT DISTINCT concat(UPPER(acronym(cc.Name)),"-",SUBSTRING_INDEX(c.CCode, "-", -1)) as CCode ,c.CreatedAt as Finised ,u.TCNo,u.FirstName,u.LastName,u.CompanyId from certificate c   inner join user u ON u.Id =c.UserId  INNER JOIN exam e ON e.Id = c.ExamId  inner JOIN course cc ON cc.Id = e.CourseId  INNER JOIN user_exam ue ON (u.Id = ue.UserId AND ue.ExamId = e.Id) WHERE ue.UserSuccessRate >= ue.MinSuccessRate AND c.IsDeleted is null and ue.IsDeleted is null  and cc.IsDeleted is null and e.IsDeleted is null'
    //'SELECT COUNT(c.Id) AS TotalCertificate FROM certificate c INNER JOIN user_exam ue ON c.CCode = ue.ExamCode  INNER JOIN exam e ON e.Id = ue.ExamId WHERE 1=1  ';

  let params = [];



  pool
    .query(sql, params)
    .then((res) => {

      if (role != 1) {
      let counter = 0;
      for(let i = 0 ; i < res.length ;i ++)
          if(res[i].CompanyId == companyId)
            counter ++;

          return callback(null, [{TotalCertificate : counter}]);
        
      }

      
     else  return callback(null, [{TotalCertificate : res.length}]);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.motnhly_libraries_enddate = function (companyId, callback) {
  let sql =
    "SELECT DATE_FORMAT(Date(EndDay),'%d.%m.%Y')  AS EndDay , COUNT(*) AS Count FROM library GROUP BY Date(EndDay) ORDER BY  Date(EndDay)";

  let params = [];

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Report.user_message_by_userid = function (
  role,
  companyid,
  queryParams,
  callback
) {
  let sql =
    'SELECT COUNT(DISTINCT message.Id)  FROM message INNER JOIN user ON message.FromUserId = user.Id OR message.ToUserId = user.Id  WHERE (FromUserId = ? OR ToUserId =?) ';
  let sql2 =
    'SELECT DISTINCT TEXT, FromUserId, ToUSerId, message.CreatedAt FROM message INNER JOIN user ON message.FromUserId = user.Id OR message.ToUserId = user.Id  WHERE (FromUserId = ? OR ToUserId =?) ';

  let params = [];
  let params2 = [];

  params.push(queryParams.filter.UserId);
  params.push(queryParams.filter.UserId);
  params2.push(queryParams.filter.UserId);
  params2.push(queryParams.filter.UserId);

  if (role != 1) {
    sql += ' and user.CompanyId = ?';
    params.push(companyid);

    sql2 += ' and user.CompanyId = ?';
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

Report.course_usage_report = function (courseid, companyid, callback) {
  let sql =
    'SELECT DISTINCT  u.TCNo , u.FirstName, u.LastName, cu.Begined, cu.Finised, TIMESTAMPDIFF(HOUR, cu.Begined, cu.Finised) AS CourseUsageTimeAsHour FROM course_user cu INNER JOIN user u ON u.Id = cu.UserId WHERE cu.CourseId = ? AND u.UserStatusId = 1 AND cu.IsDeleted IS null';

  let params = [];

  console.log('Report.course_usage_report -> courseid', courseid);
  if (courseid > 0) {
    params.push(courseid);
  }

  if (companyid != 'all') {
    sql += '  AND u.CompanyId = ?   ';
    params.push(companyid);
  }

  sql += ' ORDER BY CourseUsageTimeAsHour DESC ';

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};



Report.filterByCourseUsageReport = function (courseid, companyid,begined,finised, callback) {
  let sql =
    'SELECT DISTINCT  u.TCNo , u.FirstName, u.LastName, cu.Begined, cu.Finised, TIMESTAMPDIFF(HOUR, cu.Begined, cu.Finised) AS CourseUsageTimeAsHour FROM course_user cu INNER JOIN user u ON u.Id = cu.UserId WHERE cu.CourseId = ? AND u.UserStatusId = 1 AND cu.IsDeleted IS null';

  let params = [];


  if (courseid > 0) {
    params.push(courseid);
  }

  if (companyid != 'all') {
    sql += '  AND u.CompanyId = ?   ';
    params.push(companyid);
  }
 


  
  



  sql += ' ORDER BY CourseUsageTimeAsHour DESC ';

  pool
    .query(sql, params)
    .then((res) => {
      let temp = []
      for(let i = 0 ; i<res.length ;i ++)
    {
      if(begined && finised)
      {

      
      let startD = new Date(begined)
        let endD = new Date(finised)
        let enddate = new Date(res[i].Finised)
        let startdate = new Date(res[i].Begined)

        if(endD >= startD)
        {
          if((startD >= startdate && startD <= enddate) ||
          (startdate >= startD && startdate <= endD) )
          {
           
            temp.push(res[i])
          }
          else if (moment(res[i].Begined).format("DD/MM/YYYY") === moment(begined).format("DD/MM/YYYY") 
   
          || moment(res[i].Finised).format("DD/MM/YYYY") === moment(finised).format("DD/MM/YYYY") 
   
        
          )
          {
           temp.push(res[i])
          }

        }
      }
    }
     
      return callback(null, temp);
    })
    .catch((err) => {
      return callback(err, null);
    });
};




Report.exam_result_report = function (examid, companyid, callback) {
  let sql =
    'SELECT DISTINCT u.TCNo , u.FirstName, u.LastName, ue.Begined, ue.Finised, TIMESTAMPDIFF(MINUTE, ue.Begined, ue.Finised) AS UsageTimeAsHour, CorrectCount, WrongCount ,UserSuccessRate >= MinSuccessRate AS ExanResult , UserSuccessRate FROM user_exam ue INNER JOIN user u ON u.Id = ue.UserId WHERE ue.ExamId = ? AND u.UserStatusId = 1 AND ue.IsDeleted IS null ';

  let params = [];

  if (examid) {
    params.push(examid);
  }

  if (companyid != 'all') {
    sql += '  AND u.CompanyId = ?   ';
    params.push(companyid);
  }

  sql += ' ORDER BY UsageTimeAsHour DESC ';

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};




/**1*1*1**1*1*1 */
Report.filterByExamResultReport = function (examid, companyid,begined,finised, callback) {
  let sql =
    'SELECT DISTINCT u.TCNo , u.FirstName, u.LastName, ue.Begined, ue.Finised, TIMESTAMPDIFF(HOUR, ue.Begined, ue.Finised) AS UsageTimeAsHour, CorrectCount, WrongCount ,UserSuccessRate >= MinSuccessRate AS ExanResult , UserSuccessRate FROM user_exam ue INNER JOIN user u ON u.Id = ue.UserId WHERE ue.ExamId = ? AND u.UserStatusId = 1 AND ue.IsDeleted IS null  ';

  let params = [];

  if (examid) {
    params.push(examid);
  }

  if (companyid != 'all') {
    sql += '  AND u.CompanyId = ?   ';
    params.push(companyid);
  }

  sql += ' ORDER BY UsageTimeAsHour DESC ';

  pool
    .query(sql, params)
    .then((res) => {
      let temp = []
      for(let i = 0 ; i<res.length ;i ++)
      {
        
        let startD = new Date(begined)
        let endD = new Date(finised)
        let enddate = new Date(res[i].Finised)
        let startdate = new Date(res[i].Begined)

        if(endD >= startD)
        {
          if((startD >= startdate && startD <= enddate) ||
          (startdate >= startD && startdate <= endD) )
          {
           
            temp.push(res[i])
          }
          else if (moment(res[i].Begined).format("DD/MM/YYYY") === moment(begined).format("DD/MM/YYYY") 
   
          || moment(res[i].Finised).format("DD/MM/YYYY") === moment(finised).format("DD/MM/YYYY") 
   
        
          )
          {
           temp.push(res[i])
          }

        }
    
      }
      
     
      return callback(null, temp);
    })
    .catch((err) => {
      return callback(err, null);
    });
};


Report.course_calendar = function (companyid, callback) {
  let sql =
    ' SELECT 1 as type ,c.Name, cu.StartDate, cu.EndDate, COUNT(cu.Id)  as count FROM course c INNER JOIN course_user  cu ON cu.CourseId = c.Id INNER JOIN user u ON u.Id = cu.UserId  ';

  let params = [];

  if (companyid != 0) {
    sql += ' WHERE u.CompanyId = ? ';
    params.push(companyid);
  }

  sql +=
    '   GROUP BY cu.StartDate, cu.EndDate   UNION   SELECT 2  as type ,c.Name, cu.StartDate, cu.EndDate, COUNT(cu.Id) as count FROM exam c INNER JOIN user_exam  cu ON cu.ExamId = c.Id  INNER JOIN user u ON u.Id = cu.UserId     ';

  if (companyid != 0) {
    sql += ' WHERE u.CompanyId = ? ';
    params.push(companyid);
  }

  sql += ' GROUP BY cu.StartDate, cu.EndDate ';

  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Report;
