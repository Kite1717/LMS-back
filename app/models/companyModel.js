'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Company = function (company) {
  this.Id = company.Id;
  this.IsPublished = company.IsPublished;
  this.IsDeleted = company.IsDeleted;
  this.CreatorUserId = company.CreatorUserId;
  this.CreatedAt = company.CreatedAt;
  this.LastModifierUserId = company.LastModifierUserId;
  this.UpdatedAt = company.UpdatedAt;
  this.DeleterUserId = company.DeleterUserId;
  this.DeletedAt = company.DeletedAt;
  this.FullName = company.FullName;
  this.CompanyTypeId = company.CompanyTypeId;
  this.ShortName = company.ShortName;
  this.TaxNumber = company.TaxNumber;
  this.TaxAdministration = company.TaxAdministration;
  this.Address = company.Address;
  this.Phone = company.Phone;
  this.RelevantPersonFullName = company.RelevantPersonFullName;
  this.RelevantPersonPhone = company.RelevantPersonPhone;
  this.RelevantPersonEmail = company.RelevantPersonEmail;
  this.ContractStartDate = company.ContractStartDate;
  this.ContractEndDate = company.ContractEndDate;
  this.Logo = company.Logo;
  this.ResumeControl = company.ResumeControl;
};

Company.createCompany = function (newCompany, callback) {
  newCompany.ContractStartDate = moment(newCompany.ContractStartDate).format(
    'YYYY-MM-DD'
  );
  newCompany.ContractEndDate = moment(newCompany.ContractEndDate).format(
    'YYYY-MM-DD'
  );

  pool
    .query(
      'INSERT INTO company (IsPublished,CreatorUserId,CreatedAt, FullName,CompanyTypeId,ShortName,TaxNumber,TaxAdministration,Address,Phone,RelevantPersonFullName,RelevantPersonPhone,RelevantPersonEmail,ContractStartDate,ContractEndDate,ResumeControl ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        newCompany.IsPublished || null,
        newCompany.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newCompany.FullName,
        newCompany.CompanyTypeId || null,
        newCompany.ShortName || null,
        newCompany.TaxNumber || null,
        newCompany.TaxAdministration || null,
        newCompany.Address || null,
        newCompany.Phone || null,
        newCompany.RelevantPersonFullName || null,
        newCompany.RelevantPersonPhone || null,
        newCompany.RelevantPersonEmail || null,
        newCompany.ContractStartDate || null,
        newCompany.ContractEndDate || null,
        newCompany.Logo || null,
        newCompany.ResumeControl || null,
      ]
    )
    .then((res) => {
      newCompany.Id = res.insertId;
      return callback(null, newCompany);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Company.findCompany = function (role, companyid, queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from company  where IsDeleted is null ';
  let sql2 = 'SELECT  *  from company  where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.FullName || queryParams.filter.FullName != '') {
    let FullName = '%' + queryParams.filter.FullName + '%';
    sql += ' and FullName like ?';
    params.push(FullName);

    sql2 += ' and FullName like ?';
    params2.push(FullName);
  }

  if (queryParams.filter.Phone || queryParams.filter.Phone != '') {
    let Phone = '%' + queryParams.filter.Phone + '%';
    sql += ' and Phone like ?';
    params.push(Phone);

    sql2 += ' and Phone like ?';
    params2.push(Phone);
  }

  if (queryParams.filter.TaxNumber || queryParams.filter.TaxNumber != '') {
    let TaxNumber = '%' + queryParams.filter.TaxNumber + '%';
    sql += ' and TaxNumber like ?';
    params.push(TaxNumber);

    sql2 += ' and TaxNumber like ?';
    params2.push(TaxNumber);
  }

  if (
    queryParams.filter.RelevantPersonFullName ||
    queryParams.filter.RelevantPersonFullName != ''
  ) {
    let RelevantPersonFullName =
      '%' + queryParams.filter.RelevantPersonFullName + '%';
    sql += ' and RelevantPersonFullName like ?';
    params.push(RelevantPersonFullName);

    sql2 += ' and RelevantPersonFullName like ?';
    params2.push(RelevantPersonFullName);
  }

  if (role != 1) {
    sql += ' and Id = ?';
    params.push(companyid);

    sql2 += ' and Id = ?';
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

Company.getCompanyById = function (id, callback) {
  pool
    .query('SELECT *  FROM company c where c.Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Company.getAllCompany = function (role, companyid, callback) {
  let sql = 'SELECT *  from company where  IsDeleted is null ';
  if (role != 1) {
    sql += ' and Id = ' + companyid;
  }

  pool
    .query(sql)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Company.getAllCompanyAsTag = function (callback) {
  pool
    .query(
      'SELECT c.id , c.ShortName AS name  from company c where  c.IsDeleted is null '
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Company.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE company SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Company.updateById = function (id, company, callback) {
  company.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE company SET  ';

  if (company.FullName) {
    sql += ' FullName=?,';
    params.push(company.FullName);
  }

  if (company.CompanyTypeId) {
    sql += ' CompanyTypeId=?,';
    params.push(company.CompanyTypeId);
  }

  if (company.ShortName) {
    sql += ' ShortName=?,';
    params.push(company.ShortName);
  }

  if (company.TaxNumber) {
    sql += ' TaxNumber=?,';
    params.push(company.TaxNumber);
  }

  if (company.TaxAdministration) {
    sql += ' TaxAdministration=?,';
    params.push(company.TaxAdministration);
  }

  if (company.Address) {
    sql += ' Address=?,';
    params.push(company.Address);
  }

  if (company.Phone) {
    sql += ' Phone=?,';
    params.push(company.Phone);
  }

  if (company.RelevantPersonFullName) {
    sql += ' RelevantPersonFullName=?,';
    params.push(company.RelevantPersonFullName);
  }

  if (company.RelevantPersonPhone) {
    sql += ' RelevantPersonPhone=?,';
    params.push(company.RelevantPersonPhone);
  }

  if (company.RelevantPersonEmail) {
    sql += ' RelevantPersonEmail=?,';
    params.push(company.RelevantPersonEmail);
  }

  if (company.ContractStartDate) {
    sql += ' ContractStartDate=?,';
    params.push(moment(company.ContractStartDate).format('YYYY-MM-DD'));
  }

  if (company.ContractEndDate) {
    sql += ' ContractEndDate=?,';
    params.push(moment(company.ContractEndDate).format('YYYY-MM-DD'));
  }

  if (company.Logo) {
    sql += ' Logo=?,';
    params.push(company.Logo);
  }

  if (company.ResumeControl) {
    sql += ' ResumeControl=?,';
    params.push(company.ResumeControl);
  }

  if (company.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(company.UpdatedAt);
  }

  if (company.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(company.LastModifierUserId);
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

module.exports = Company;
