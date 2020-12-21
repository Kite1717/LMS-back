'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Certificate = function (certificate) {
  this.Id = certificate.Id;
  this.IsPublished = certificate.IsPublished;
  this.IsDeleted = certificate.IsDeleted;
  this.CreatorUserId = certificate.CreatorUserId;
  this.CreatedAt = certificate.CreatedAt;
  this.LastModifierUserId = certificate.LastModifierUserId;
  this.UpdatedAt = certificate.UpdatedAt;
  this.DeleterUserId = certificate.DeleterUserId;
  this.DeletedAt = certificate.DeletedAt;
  this.CertificateTemplateId = certificate.CertificateTemplateId;
  this.UserId = certificate.UserId;
  this.CCode = certificate.CCode; // created certificate code / certificate id
  this.ExamId = certificate.ExamId;
};

Certificate.createCertificate = function (newCertificate, callback) {

  pool
    .query("SELECT CCode FROM certificate ORDER BY id DESC LIMIT 1")
    .then((res)=>{
        let newCode ;
        if(res[0] !== null && res[0] !== undefined)
        {
          let  pieces = res[0].CCode.split("-");
          let code = pieces[pieces.length -1]
          newCode = Number(code) + 1
          newCode = "-" + newCode;
        }
        else{
          newCode = "-100000001"

        }

        pool
        .query(
          'INSERT INTO certificate (IsPublished,CreatorUserId,CreatedAt, UserId,CCode,ExamId ) values (?,?,?,?,?,?)',
          [
            newCertificate.IsPublished || null,
            newCertificate.CreatorUserId,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            newCertificate.UserId,
            newCertificate.CCode + newCode,
            newCertificate.ExamId,
          ]
        )
        .then((res) => {
          return callback(null, res);
        })
        .catch((err) => {
          console.log('Certificate.createCertificate -> err', err);
          return callback(err, null);
        });
      

    })
 
};

Certificate.getCertificatePaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/certificates/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from certificate ')
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
          'SELECT (SELECT count(*) from certificate)  as linecount, b.*  from certificate b LIMIT ' +
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

Certificate.getCertificateById = function (id, callback) {
  pool
    .query('Select x.* from certificate x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Certificate.getAllCertificate = function (callback) {
  pool
    .query('SELECT *  from certificate ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Certificate.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM certificate WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Certificate.updateById = function (id, uid, certificate, callback) {
  certificate.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  certificate.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE certificate SET  ';

  if (certificate.CertificateTemplateId) {
    sql += ' CertificateTemplateId=?,';
    params.push(certificate.CertificateTemplateId);
  }

  if (certificate.UserId) {
    sql += ' UserId=?,';
    params.push(certificate.UserId);
  }

  if (certificate.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(certificate.UpdatedAt);
  }

  if (certificate.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(certificate.LastModifierUserId);
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

Certificate.findCertificate = function (
  role,
  companyid,
  queryParams,
  callback
) {
  let sql =
    'SELECT   COUNT(c.Id) as totalCount   from certificate c INNER JOIN user_exam ue ON c.CCode = ue.ExamCode INNER JOIN user u ON  ue.UserId = u.Id   WHERE c.IsDeleted is null ';
  let sql2 =
  'SELECT DISTINCT concat(UPPER(acronym(cc.Name)),"-",SUBSTRING_INDEX(c.CCode, "-", -1)) as CCode ,c.CreatedAt as Finised ,u.TCNo,u.FirstName,u.LastName from certificate c   inner join user u ON u.Id =c.UserId  INNER JOIN exam e ON e.Id = c.ExamId  inner JOIN course cc ON cc.Id = e.CourseId  INNER JOIN user_exam ue ON (u.Id = ue.UserId AND ue.ExamId = e.Id) WHERE ue.UserSuccessRate >= ue.MinSuccessRate AND c.IsDeleted is null and ue.IsDeleted is null  and cc.IsDeleted is null and e.IsDeleted is null'
  let params = [];
  let params2 = [];
  console.log(queryParams.filter.CCode,"asdasdasadsadaadadada")

  if (queryParams.filter.CCode || queryParams.filter.CCode != '') {
    let CCode = '%' + queryParams.filter.CCode + '%';
    sql += ' and CCode like ?';
    params.push(CCode);

    sql2 += ' and concat(UPPER(acronym(cc.Name)),"-",SUBSTRING_INDEX(c.CCode, "-", -1)) like ?';
    params2.push(CCode);
  }

  if (queryParams.filter.TCNo || queryParams.filter.TCNo != '') {
    let TCNo = '%' + queryParams.filter.TCNo + '%';
    sql += ' and u.TCNo like ?';
    params.push(TCNo);

    sql2 += ' and u.TCNo like ?';
    params2.push(TCNo);
  }

  if (role != 1) {
    sql += ' and u.CompanyId = ?';
    params.push(companyid);

    sql2 += ' and u.CompanyId = ?';
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

module.exports = Certificate;
