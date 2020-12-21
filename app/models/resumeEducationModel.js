'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var ResumEducation = function (resum_education) {
  this.Id = resum_education.Id;
  this.IsPublished = resum_education.IsPublished;
  this.IsDeleted = resum_education.IsDeleted;
  this.CreatorUserId = resum_education.CreatorUserId;
  this.CreatedAt = resum_education.CreatedAt;
  this.LastModifierUserId = resum_education.LastModifierUserId;
  this.UpdatedAt = resum_education.UpdatedAt;
  this.DeleterUserId = resum_education.DeleterUserId;
  this.DeletedAt = resum_education.DeletedAt;

  this.OkulUnvani = resum_education.OkulUnvani;
  this.OkulAdresi = resum_education.OkulAdresi;
  this.TeyitDurumu = resum_education.TeyitDurumu;
  this.ResumeId = resum_education.ResumeId;
};

ResumEducation.createResumEducation = function (
  newResumEducation,

  callback
) {
  pool
    .query(
      'INSERT INTO resume_education (IsPublished,CreatorUserId,CreatedAt,OkulUnvani,OkulAdresi, TeyitDurumu, ResumeId) values (?,?,?,?,?,?,?)',
      [
        newResumEducation.IsPublished || null,
        newResumEducation.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newResumEducation.OkulUnvani,
        newResumEducation.OkulAdresi || null,
        null,
        newResumEducation.ResumeId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumEducation.getResumEducationPaged = function (req, callback) {
  let Pagination = require('../resum_educationers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/resum_educations/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from resum_education ')
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
          'SELECT (SELECT count(*) from resum_education)  as linecount, b.*  from resum_education b LIMIT ' +
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

ResumEducation.getResumEducationById = function (id, callback) {
  pool
    .query('Select x.* from resum_education x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumEducation.getAllResumEducation = function (callback) {
  pool
    .query('SELECT *  from resum_education ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumEducation.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM resum_education WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumEducation.updateById = function (id, uid, resum_education, callback) {
  resum_education.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  resum_education.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE resum_education SET  ';

  if (resum_education.OkulUnvani) {
    sql += ' OkulUnvani=?,';
    params.push(resum_education.OkulUnvani);
  }

  if (resum_education.OkulAdresi) {
    sql += ' OkulAdresi=?,';
    params.push(resum_education.OkulAdresi);
  }

  if (resum_education.TeyitDurumu) {
    sql += ' TeyitDurumu=?,';
    params.push(resum_education.TeyitDurumu);
  }

  if (resum_education.ResumeId) {
    sql += ' ResumeId=?,';
    params.push(resum_education.ResumeId);
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

module.exports = ResumEducation;
