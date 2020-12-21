'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CoursePackageCompany = function (course_package_company) {
  this.Id = course_package_company.Id;
  this.IsPublished = course_package_company.IsPublished;
  this.IsDeleted = course_package_company.IsDeleted;
  this.CreatorUserId = course_package_company.CreatorUserId;
  this.CreatedAt = course_package_company.CreatedAt;
  this.LastModifierUserId = course_package_company.LastModifierUserId;
  this.UpdatedAt = course_package_company.UpdatedAt;
  this.DeleterUserId = course_package_company.DeleterUserId;
  this.DeletedAt = course_package_company.DeletedAt;
  this.CompanyId = course_package_company.CompanyId;
  this.CoursePackageId = course_package_company.CoursePackageId;
};

CoursePackageCompany.createCoursePackageCompany = function (
  newCoursePackageCompany,
  callback
) {
  pool
    .query(
      'INSERT INTO course_package_company (IsPublished,CreatorUserId,CreatedAt, CompanyId,CoursePackageId) values (?,?,?,?,?)',
      [
        newCoursePackageCompany.IsPublished || null,
        newCoursePackageCompany.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCoursePackageCompany.CompanyId,
        newCoursePackageCompany.CoursePackageId,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.findCoursePackageCompany = function (
  role,
  companyid,
  queryParams,
  callback
) {
  // //course package
  // // let sql =
  // //   'SELECT  COUNT(cp.Id) as totalCount  from course_package cp inner join course_package_company cpc  on cp.Id = cpc.CoursePackageId  where cp.IsDeleted is null ';
  // // let sql2 =
  // //   'SELECT  DISTINCT cp.*  from course_package cp inner join course_package_company cpc  on cp.Id = cpc.CoursePackageId  where cp.IsDeleted is null  ';


  // //course package
  // let sql =
  //   'SELECT COUNT(c.Id) as totalCount   FROM course c WHERE c.IsDeleted IS null';
  // let sql2 =
  //   'SELECT c.* FROM course c WHERE c.IsDeleted IS null ';
  // //courses

  // let params = [];
  // let params2 = [];

  // if (queryParams.filter.Name || queryParams.filter.Name != '') {
  //   let Name = '%' + queryParams.filter.Name + '%';
  //   sql += ' and c.Name like ?';  // cp
  //   params.push(Name);

  //   sql2 += ' and c.Name like ?';  // cp
  //   params2.push(Name);
  // }

  // // if (role != 1) {
  // //   sql += ' and c.CompanyId = ?';  // cpc
  // //   params.push(companyid);

  // //   sql2 += ' and c.CompanyId = ?';  // cpc

  // //   params2.push(companyid);
  // // }

  // sql2 += ' limit ?,?';
  // let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  // let limit2 = queryParams.pageSize;
  // params2.push(limit1);
  // params2.push(limit2);

  // pool
  //   .query(sql, params)
  //   .then((res) => {
  //     let totalCount = res[0].totalCount;
  //     pool.query(sql2, params2).then((res) => {
  //       let data = {
  //         entities: res,
  //         totalCount: totalCount,
  //       };
  //       return callback(null, data);
  //     });
  //   })
  //   .catch((err) => {
  //     return callback(err, null);
  //   });




    let sql =
    ' SELECT   COUNT( course.Id) as totalCount  from course inner join course_package on course.CoursePackageId = course_package.Id LEFT JOIN exam e ON course.Id = e.CourseId  LEFT JOIN library l ON (course.Id = l.CourseId  and  l.IsDeleted is null)  where course.IsDeleted is NULL';
  let sql2 =
    ' SELECT DISTINCT  count(distinct l.file) AS FileCount, course.*,course_package.Name as CoursePackageName, fnStripTags(course.Description) as Descr , e.ExamTypeId from course inner join course_package on course.CoursePackageId = course_package.Id LEFT JOIN exam e ON course.Id = e.CourseId  LEFT JOIN library l ON (course.Id = l.CourseId  and  l.IsDeleted is null)  where course.IsDeleted is NULL   ';

  
  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    // sql += ' and course.Name like ? ';
    // params.push(Name);

    sql2 += 'and  course.Name like ? ';
    params2.push(Name);
  }


  sql += '  GROUP BY course.Id ';

  sql2 += '  GROUP BY course.Id ';

  sql2 += ' order by course.Name limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  pool
    .query(sql, params)
    .then((res) => {
 
      pool.query(sql2, params2).then((res) => {
      
        for(let i = 0 ; i< res.length ; i ++)
        {
          res[i].ExamTypeId = 1 
        }
        let data = {
          entities: res,
          totalCount: res.length,
        };
        
        return callback(null, data);
      });
    })
    .catch((err) => {
      console.log('Course.findCourse -> err', err);
      return callback(err, null);
    });


};

CoursePackageCompany.getCoursePackageCompanyById = function (id, callback) {
  pool
    .query('Select x.* from course_package_company x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.getCoursePackageCompanyByPackageId = function (
  id,
  callback
) {
  pool
    .query(
      'Select distinct x.CompanyId, c.ShortName from course_package_company x inner join company c on c.Id = x.CompanyId  where CoursePackageId = ? and x.IsDeleted is null ',
      id
    )
    .then((res) => {
      '';
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.getAllCoursePackageCompany = function (callback) {
  pool
    .query('SELECT *  from course_package_company where IsDeteleted is null ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course_package_company set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.removebyPackageIdCompanyId = function (
  pid,
  cid,
  uid,
  callback
) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE course_package_company set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE CoursePackageId = ? and CompanyId=?',
      [deletedAt, uid, pid, cid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CoursePackageCompany.updateById = function (
  id,
  uid,
  course_package_company,
  callback
) {
  course_package_company.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  course_package_company.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE course_package_company SET  ';

  if (course_package_company.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(course_package_company.CompanyId);
  }

  if (course_package_company.CoursePackageId) {
    sql += ' CoursePackageId=?,';
    params.push(course_package_company.CoursePackageId);
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

module.exports = CoursePackageCompany;
