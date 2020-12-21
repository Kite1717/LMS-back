'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Resume = function (resume) {
  this.Id = resume.Id;
  this.IsPublished = resume.IsPublished;
  this.IsDeleted = resume.IsDeleted;
  this.CreatorUserId = resume.CreatorUserId;
  this.CreatedAt = resume.CreatedAt;
  this.LastModifierUserId = resume.LastModifierUserId;
  this.UpdatedAt = resume.UpdatedAt;
  this.DeleterUserId = resume.DeleterUserId;
  this.DeletedAt = resume.DeletedAt;
  this.Istihdam28GunBosluk = resume.Istihdam28GunBosluk;
  this.BoslukSebebiSorulduMu = resume.BoslukSebebiSorulduMu;
  this.BoslukAciklama = resume.BoslukAciklama;
  this.IstihdamKontrolSonucu = resume.IstihdamKontrolSonucu;
  this.IstihdamKontrolAciklama = resume.IstihdamKontrolAciklama;
  this.EgitimDurumu = resume.EgitimDurumu;
  this.AdliSicilBelgeSunulduMu = resume.AdliSicilBelgeSunulduMu;
  this.AdliSicilKaydiVarMi = resume.AdliSicilKaydiVarMi;
  this.AdliSicilArsivKaydiVarMi = resume.AdliSicilArsivKaydiVarMi;
  this.HakkindaSorusturmaVarMi = resume.HakkindaSorusturmaVarMi;
  this.TerorVsNedeniyleKamudanCikarilmisMi =
    resume.TerorVsNedeniyleKamudanCikarilmisMi;
  this.OzgecmisKontrolSonucu = resume.OzgecmisKontrolSonucu;
  this.HGPSvarmi = resume.HGPSvarmi;
  this.TPSSvarmi = resume.TPSSvarmi;
  this.OnaylandiMi = resume.OnaylandiMi;
  this.HGPSbitis = resume.HGPSbitis;
  this.TPSSbitis = resume.TPSSbitis;
  this.UserId = resume.UserId;
};

Resume.createResume = function (newResume, callback) {
  pool
    .query(
      'INSERT INTO resume (IsPublished,CreatorUserId,CreatedAt,Istihdam28GunBosluk,BoslukSebebiSorulduMu,BoslukAciklama, IstihdamKontrolSonucu,IstihdamKontrolAciklama,EgitimDurumu, AdliSicilBelgeSunulduMu, AdliSicilKaydiVarMi, AdliSicilArsivKaydiVarMi,HakkindaSorusturmaVarMi, TerorVsNedeniyleKamudanCikarilmisMi,OzgecmisKontrolSonucu,HGPSvarmi,TPSSvarmi ,OnaylandiMi,HGPSbitis,TPSSbitis,UserId) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        newResume.IsPublished || null,
        newResume.UserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newResume.Istihdam28GunBosluk || null,
        newResume.BoslukSebebiSorulduMu || null,
        newResume.BoslukAciklama || null,
        newResume.IstihdamKontrolSonucu || null,
        newResume.IstihdamKontrolAciklama || null,
        newResume.EgitimDurumu || null,
        newResume.AdliSicilBelgeSunulduMu || null,
        newResume.AdliSicilKaydiVarMi || null,
        newResume.AdliSicilArsivKaydiVarMi || null,
        newResume.HakkindaSorusturmaVarMi || null,
        newResume.TerorVsNedeniyleKamudanCikarilmisMi || null,
        newResume.OzgecmisKontrolSonucu || null,
        newResume.HGPSvarmi || null,
        newResume.TPSSvarmi || null,
        newResume.OnaylandiMi || null,
        newResume.HGPSbitis || null,
        newResume.TPSSbitis || null,
        newResume.UserId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Resume.getResumePaged = function (req, callback) {
  let Pagination = require('../resumeers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/resumes/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from resume ')
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
          'SELECT (SELECT count(*) from resume)  as linecount, b.*  from resume b LIMIT ' +
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

Resume.getResumeById = function (id, callback) {
  pool
    .query('Select x.* from resume x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Resume.getAllResume = function (callback) {
  pool
    .query('SELECT *  from resume ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Resume.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM resume WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Resume.updateById = function (id, uid, resume, callback) {
  resume.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  resume.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE resume SET  ';

  if (resume.Istihdam28GunBosluk) {
    sql += ' Istihdam28GunBosluk=?,';
    params.push(resume.Istihdam28GunBosluk);
  }

  if (resume.BoslukSebebiSorulduMu) {
    sql += ' BoslukSebebiSorulduMu=?,';
    params.push(resume.BoslukSebebiSorulduMu);
  }

  if (resume.BoslukAciklama) {
    sql += ' BoslukAciklama=?,';
    params.push(resume.BoslukAciklama);
  }

  if (resume.IstihdamKontrolSonucu) {
    sql += ' IstihdamKontrolSonucu=?,';
    params.push(resume.IstihdamKontrolSonucu);
  }

  if (resume.IstihdamKontrolAciklama) {
    sql += ' IstihdamKontrolAciklama=?,';
    params.push(resume.IstihdamKontrolAciklama);
  }

  if (resume.EgitimDurumu) {
    sql += ' EgitimDurumu=?,';
    params.push(resume.EgitimDurumu);
  }

  if (resume.AdliSicilBelgeSunulduMu) {
    sql += ' AdliSicilBelgeSunulduMu=?,';
    params.push(resume.AdliSicilBelgeSunulduMu);
  }

  if (resume.AdliSicilKaydiVarMi) {
    sql += ' AdliSicilKaydiVarMi=?,';
    params.push(resume.AdliSicilKaydiVarMi);
  }

  if (resume.AdliSicilArsivKaydiVarMi) {
    sql += ' AdliSicilArsivKaydiVarMi=?,';
    params.push(resume.AdliSicilArsivKaydiVarMi);
  }

  if (resume.HakkindaSorusturmaVarMi) {
    sql += ' HakkindaSorusturmaVarMi=?,';
    params.push(resume.HakkindaSorusturmaVarMi);
  }

  if (resume.TerorVsNedeniyleKamudanCikarilmisMi) {
    sql += ' TerorVsNedeniyleKamudanCikarilmisMi=?,';
    params.push(resume.TerorVsNedeniyleKamudanCikarilmisMi);
  }

  if (resume.OzgecmisKontrolSonucu) {
    sql += ' OzgecmisKontrolSonucu=?,';
    params.push(resume.OzgecmisKontrolSonucu);
  }

  if (resume.HGPSvarmi) {
    sql += ' HGPSvarmi=?,';
    params.push(resume.HGPSvarmi);
  }

  if (resume.TPSSvarmi) {
    sql += ' TPSSvarmi=?,';
    params.push(resume.TPSSvarmi);
  }

  if (resume.OnaylandiMi) {
    sql += ' OnaylandiMi=?,';
    params.push(resume.OnaylandiMi);
  }

  if (resume.HGPSbitis) {
    sql += ' HGPSbitis=?,';
    params.push(resume.HGPSbitis);
  }

  if (resume.TPSSbitis) {
    sql += ' TPSSbitis=?,';
    params.push(resume.HGPSTPSSbitisbitis);
  }

  if (resume.UserId) {
    sql += ' UserId=?,';
    params.push(resume.UserId);
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

module.exports = Resume;
