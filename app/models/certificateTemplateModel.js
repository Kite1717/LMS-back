'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var CertificateTemplate = function (certificateTemplate) {
  this.Id = certificateTemplate.Id;
  this.IsPublished = certificateTemplate.IsPublished;
  this.IsDeleted = certificateTemplate.IsDeleted;
  this.CreatorUserId = certificateTemplate.CreatorUserId;
  this.CreatedAt = certificateTemplate.CreatedAt;
  this.LastModifierUserId = certificateTemplate.LastModifierUserId;
  this.UpdatedAt = certificateTemplate.UpdatedAt;
  this.DeleterUserId = certificateTemplate.DeleterUserId;
  this.DeletedAt = certificateTemplate.DeletedAt;
  this.CourseId = certificateTemplate.CourseId;
  this.CompanyId = certificateTemplate.CompanyId;
};

CertificateTemplate.createCertificateTemplate = function (
  newCertificateTemplate,
  uid,
  callback
) {
  pool
    .query(
      'INSERT INTO certificate_template (IsPublished,CreatorallowedIpId,CreatedAt, Title,Text ) values (?,?,?,?,?)',
      [
        newAllowedIp.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newAllowedIp.Title,
        newAllowedIp.Text || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CertificateTemplate.getCertificateTemplatePaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/certificate_templates/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from certificate_template ')
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
          'SELECT (SELECT count(*) from certificate_template)  as linecount, b.*  from certificate_template b LIMIT ' +
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

CertificateTemplate.getCertificateTemplateById = function (id, callback) {
  pool
    .query('Select x.* from certificate_template x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CertificateTemplate.getAllCertificateTemplate = function (callback) {
  pool
    .query('SELECT *  from certificate_template ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CertificateTemplate.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM certificate_template WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

CertificateTemplate.updateById = function (
  id,
  uid,
  certificateTemplate,
  callback
) {
  certificateTemplate.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  certificateTemplate.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE certificate_template SET  ';

  if (announcement.CourseId) {
    sql += ' CourseId=?,';
    params.push(announcement.CourseId);
  }

  if (announcement.Text) {
    sql += ' Text=?,';
    params.push(announcement.Text);
  }

  if (announcement.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(announcement.CompanyId);
  }

  if (announcement.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(announcement.LastModifierUserId);
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

module.exports = CertificateTemplate;
