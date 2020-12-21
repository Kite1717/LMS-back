'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var ResumCompany = function (resume_company) {
  this.Id = resume_company.Id;
  this.IsPublished = resume_company.IsPublished;
  this.IsDeleted = resume_company.IsDeleted;
  this.CreatorUserId = resume_company.CreatorUserId;
  this.CreatedAt = resume_company.CreatedAt;
  this.LastModifierUserId = resume_company.LastModifierUserId;
  this.UpdatedAt = resume_company.UpdatedAt;
  this.DeleterUserId = resume_company.DeleterUserId;
  this.DeletedAt = resume_company.DeletedAt;

  this.Unvan = resume_company.Unvan;
  this.BaslamaTarihi = resume_company.BaslamaTarihi;
  this.BitisTarihi = resume_company.BitisTarihi;
  this.YetkiliAdi = resume_company.YetkiliAdi;
  this.YetkiliTel = resume_company.YetkiliTel;
  this.TeyitDurumu = resume_company.TeyitDurumu;
  this.ResumeId = resume_company.ResumeId;
};

ResumCompany.createResumCompany = function (newResumCompany, callback) {
  pool
    .query(
      'INSERT INTO resume_company (IsPublished,CreatorUserId,CreatedAt,Unvan,BaslamaTarihi,BitisTarihi, YetkiliAdi,YetkiliTel,TeyitDurumu,ResumeId) values (?,?,?,?,?,?,?,?,?,?)',
      [
        newResumCompany.IsPublished || null,
        newResumCompany.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newResumCompany.Unvan,
        newResumCompany.BaslamaTarihi || null,
        newResumCompany.BitisTarihi || null,
        newResumCompany.YetkiliAdi || null,
        newResumCompany.YetkiliTel || null,
        0,
        newResumCompany.ResumeId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumCompany.getResumCompanyPaged = function (req, callback) {
  let Pagination = require('../resume_companyers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/resume_companys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from resume_company ')
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
          'SELECT (SELECT count(*) from resume_company)  as linecount, b.*  from resume_company b LIMIT ' +
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

ResumCompany.getResumCompanyById = function (id, callback) {
  pool
    .query('Select x.* from resume_company x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumCompany.getAllResumCompany = function (callback) {
  pool
    .query('SELECT *  from resume_company ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumCompany.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM resume_company WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

ResumCompany.updateById = function (id, uid, resume_company, callback) {
  resume_company.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  resume_company.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE resume_company SET  ';

  if (resume_company.Istihdam28GunBosluk) {
    sql += ' Istihdam28GunBosluk=?,';
    params.push(resume_company.Istihdam28GunBosluk);
  }

  if (resume_company.BoslukSebebiSorulduMu) {
    sql += ' BoslukSebebiSorulduMu=?,';
    params.push(resume_company.BoslukSebebiSorulduMu);
  }

  if (resume_company.BoslukAciklama) {
    sql += ' BoslukAciklama=?,';
    params.push(resume_company.BoslukAciklama);
  }

  if (resume_company.IstihdamKontrolSonucu) {
    sql += ' IstihdamKontrolSonucu=?,';
    params.push(resume_company.IstihdamKontrolSonucu);
  }

  if (resume_company.IstihdamKontrolAciklama) {
    sql += ' IstihdamKontrolAciklama=?,';
    params.push(resume_company.IstihdamKontrolAciklama);
  }

  if (resume_company.EgitimDurumu) {
    sql += ' EgitimDurumu=?,';
    params.push(resume_company.EgitimDurumu);
  }

  if (resume_company.AdliSicilBelgeSunulduMu) {
    sql += ' AdliSicilBelgeSunulduMu=?,';
    params.push(resume_company.AdliSicilBelgeSunulduMu);
  }

  if (resume_company.AdliSicilKaydiVarMi) {
    sql += ' AdliSicilKaydiVarMi=?,';
    params.push(resume_company.AdliSicilKaydiVarMi);
  }

  if (resume_company.AdliSicilArsivKaydiVarMi) {
    sql += ' AdliSicilArsivKaydiVarMi=?,';
    params.push(resume_company.AdliSicilArsivKaydiVarMi);
  }

  if (resume_company.HakkindaSorusturmaVarMi) {
    sql += ' HakkindaSorusturmaVarMi=?,';
    params.push(resume_company.HakkindaSorusturmaVarMi);
  }

  if (resume_company.TerorVsNedeniyleKamudanCikarilmisMi) {
    sql += ' TerorVsNedeniyleKamudanCikarilmisMi=?,';
    params.push(resume_company.TerorVsNedeniyleKamudanCikarilmisMi);
  }

  if (resume_company.OzgecmisKontrolSonucu) {
    sql += ' OzgecmisKontrolSonucu=?,';
    params.push(resume_company.OzgecmisKontrolSonucu);
  }

  if (resume_company.HGPSvarmi) {
    sql += ' HGPSvarmi=?,';
    params.push(resume_company.HGPSvarmi);
  }

  if (resume_company.TPSSvarmi) {
    sql += ' TPSSvarmi=?,';
    params.push(resume_company.TPSSvarmi);
  }

  if (resume_company.OnaylandiMi) {
    sql += ' OnaylandiMi=?,';
    params.push(resume_company.OnaylandiMi);
  }

  if (resume_company.HGPSbitis) {
    sql += ' HGPSbitis=?,';
    params.push(resume_company.HGPSbitis);
  }

  if (resume_company.TPSSbitis) {
    sql += ' TPSSbitis=?,';
    params.push(resume_company.HGPSTPSSbitisbitis);
  }

  if (resume_company.UserId) {
    sql += ' UserId=?,';
    params.push(resume_company.UserId);
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

module.exports = ResumCompany;
