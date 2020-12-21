'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var ActivityLog = function (activityLog) {
  this.Id = activityLog.Id;

  this.CreatorUserId = activityLog.CreatorUserId;
  this.CreatedAt = activityLog.CreatedAt;

  this.CompanyId = activityLog.CompanyId;
  this.Detail = activityLog.Detail;
  this.IpAddress = activityLog.IpAddress;
};

ActivityLog.createActivityLog = function (newActivityLog, callback) {

 
  pool
    .query(
      'INSERT INTO activity_log (CreatorUserId,CreatedAt, CompanyId,Detail,IpAddress) values (?,?,?,?,?)',
      [
        newActivityLog.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newActivityLog.CompanyId || null,
        newActivityLog.Detail || null,
        newActivityLog.IpAddress,
      ]
    )
    .then((res) => {
      newActivityLog.Id = res.insertId;
      return callback(null, newActivityLog);
    })
    .catch((err) => {
      console.log('ActivityLog.createActivityLog -> err', err);
      return callback(err, null);
    });
};



ActivityLog.calculateTotalDuration = function (id, callback) {

  pool
    .query(
      'SELECT CreatedAt FROM activity_log WHERE CreatorUserId = ? AND Detail = "Giriş Yaptı"',
      [
        id
      ]
    )
    .then((res) => {

    
      pool
    .query(
      'SELECT CreatedAt FROM activity_log WHERE CreatorUserId = ? AND Detail = "Çıkış Yaptı"',
      [
        id
      ]
    )
    .then((res2) => {
      let data ={
        enter : res,
        exit :  res2
        
      }


      return callback(null, data);
    })

    
    })
    .catch((err) => {
      console.log('ActivityLog.calculateActivityLog -> err', err);
      return callback(err, null);
    });
};

ActivityLog.findActivityLog = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(activityLog.Id) as totalCount  from activity_log   where 1=1 ';
  let sql2 = 'SELECT  activityLog.* from activity_log   where 1=1 ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    sql += " and Name like '%?%'";
    params.push(queryParams.filter.Name);

    sql2 += " and Name like '%?%'";
    params2.push(queryParams.filter.Name);
  }

  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    sql += " and Description like CONCAT('%', ?,  '%') ";
    params.push(queryParams.filter.Description);

    sql2 += " and Description like CONCAT('%', ?,  '%')";
    params2.push(queryParams.filter.Description);
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

ActivityLog.getActivityLog = function (companyId, callback) {
  let sql =
    'SELECT  COUNT(activity_log.Id) as totalCount  from activity_log inner join user on user.Id = activity_log.CreatorUserId   where 1=1 ';
  let sql2 =
    "SELECT  activity_log.*, concat(user.FirstName , ' '   , user.LastName) as FullName from activity_log   inner join user on user.Id = activity_log.CreatorUserId   where 1=1 ";

  let params = [];
  let params2 = [];

  /*
  
  if (companyId != undefined && companyId != '') {
    sql += ' and CompanyId = ?';
    params.push(companyId);

    sql += ' and CompanyId = ?';
    params2.push(companyId);
  }

  */

  sql +=
    ' and activity_log.CreatedAt > date(NOW())   ORDER BY activity_log.Id DESC LIMIT 0,20 ';

  sql2 +=
    ' and activity_log.CreatedAt > date(NOW())   ORDER BY activity_log.Id DESC LIMIT 0,20';

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

module.exports = ActivityLog;
