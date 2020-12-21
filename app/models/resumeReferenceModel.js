'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var ResumeReference = function (resume_reference) {
  this.Id = resume_reference.Id;
  this.IsPublished = resume_reference.IsPublished;
  this.IsDeleted = resume_reference.IsDeleted;
  this.CreatorUserId = resume_reference.CreatorUserId;
  this.CreatedAt = resume_reference.CreatedAt;
  this.LastModifierUserId = resume_reference.LastModifierUserId;
  this.UpdatedAt = resume_reference.UpdatedAt;
  this.DeleterUserId = resume_reference.DeleterUserId;
  this.DeletedAt = resume_reference.DeletedAt;

  this.AdSoyad = resume_reference.AdSoyad;
  this.Unvan = resume_reference.Unvan;
  this.Tel = resume_reference.Tel;
  this.OlumluMu = resume_reference.OlumluMu;
  this.ResumeId = resume_reference.ResumeId;
};

ResumeReference.createResumeReference = function (
  newResumeReference,
  callback
) {
  pool
    .query(
      'INSERT INTO resume_reference (IsPublished,CreatorUserId,CreatedAt,AdSoyad,Unvan, Tel, OlumluMu, ResumeId ) values (?,?,?,?,?,?,?,?)',
      [
        newResumeReference.IsPublished || null,
        newResumeReference.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newResumeReference.AdSoyad,
        newResumeReference.Unvan || null,
        newResumeReference.Tel || null,
        0,
        newResumeReference.ResumeId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumeReference.getResumeReferencePaged = function (req, callback) {
  let Pagination = require('../resume_referenceers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/resume_references/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from resume_reference ')
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
          'SELECT (SELECT count(*) from resume_reference)  as linecount, b.*  from resume_reference b LIMIT ' +
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

ResumeReference.getResumeReferenceById = function (id, callback) {
  pool
    .query('Select x.* from resume_reference x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumeReference.getAllResumeReference = function (callback) {
  pool
    .query('SELECT *  from resume_reference ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumeReference.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM resume_reference WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumeReference.updateById = function (id, uid, resume_reference, callback) {
  resume_reference.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  resume_reference.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE resume_reference SET  ';

  if (resume_reference.AdSoyad) {
    sql += ' AdSoyad=?,';
    params.push(resume_reference.AdSoyad);
  }

  if (resume_reference.Unvan) {
    sql += ' Unvan=?,';
    params.push(resume_reference.Unvan);
  }

  if (resume_reference.Tel) {
    sql += ' Tel=?,';
    params.push(resume_reference.Tel);
  }

  if (resume_reference.OlumluMu) {
    sql += ' OlumluMu=?,';
    params.push(resume_reference.OlumluMu);
  }

  if (resume_reference.ResumeId) {
    sql += ' ResumeId=?,';
    params.push(resume_reference.ResumeId);
  }

  if (resume_reference.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(resume_reference.UpdatedAt);
  }

  if (resume_reference.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(resume_reference.LastModifierUserId);
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

module.exports = ResumeReference;
