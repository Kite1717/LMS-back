'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var BulkFile = function (bulkFile) {
  this.Id = bulkFile.Id;
  this.CreatorUserId = bulkFile.CreatorUserId;
  this.CreatedAt = bulkFile.CreatedAt;
  this.File = bulkFile.File;
  this.IsInsertedToDb = bulkFile.IsInsertedToDb;
  this.FileTypeId = bulkFile.FileTypeId;
  this.TopicId = bulkFile.TopicId;
  this.CompanyId = bulkFile.CompanyId;
};

BulkFile.createBulkFile = function (newBulkFile, callback) {

  pool
    .query(
      'INSERT INTO bulk_file (CreatorUserId,CreatedAt,IsInsertedToDb,FileTypeId, File ,TopicId, CompanyId) values (?,?,?,?,?,?,?)',
      [
        newBulkFile.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
       newBulkFile.IsInsertedToDb || null,
       //  1,
        newBulkFile.FileTypeId,
        newBulkFile.File,
        newBulkFile.TopicId || null,
        newBulkFile.CompanyId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

BulkFile.findBulkFile = function (queryParams, callback) {
  let sql = 'SELECT  COUNT(Id) as totalCount  from bulk_file ';
  let sql2 = 'SELECT  *  from bulk_file  ';

  let params = [];
  let params2 = [];

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

BulkFile.getAllBulkFileByStatus = function (callback) {
  pool
    .query('SELECT * from bulk_file  where IsInsertedToDb is null ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

BulkFile.updateBulkFileStatus = function (id, callback) {
  UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE bulk_file SET IsInsertedToDb = 1';

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

module.exports = BulkFile;
