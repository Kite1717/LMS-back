'use strict';

const jwt = require('jsonwebtoken');
var Resume = require('../models/resumeModel.js');

var ResumeEducation = require('../models/resumeEducationModel');
var ResumeCompany = require('../models/resumeCompanyModel');
var ResumeReference = require('../models/resumeReferenceModel');

const { secret } = require('../../config.json');

exports.list_resumes_paged = function (req, res) {
  Resume.getResumePaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_resumes = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Resume.getAllResume(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_resumes = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Resume.findResume(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_resume = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_resume = new Resume(req.body.StaticData);

  new_resume.CreatorUserId = req.user.uid;
  new_resume.UserId = req.user.uid;

  new_resume.AdliSicilBelgeSunulduMu = new_resume.AdliSicilBelgeSunulduMu
    ? 1
    : 0;
  new_resume.AdliSicilKaydiVarMi = new_resume.AdliSicilKaydiVarMi ? 1 : 0;
  new_resume.AdliSicilArsivKaydiVarMi = new_resume.AdliSicilArsivKaydiVarMi
    ? 1
    : 0;
  new_resume.TerorVsNedeniyleKamudanCikarilmisMi = new_resume.TerorVsNedeniyleKamudanCikarilmisMi
    ? 1
    : 0;

  /* console.log('exports.create_a_resume -> new_resume', new_resume);
  console.log('exports.create_a_resume -> new_resume', School);
   console.log('exports.create_a_resume -> new_resume', JobTitle);
  console.log('exports.create_a_resume -> new_resume', Reference);*/

  if (!new_resume.CreatorUserId) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Resume.createResume(new_resume, function (err, result) {
      if (err) {
        console.log('exports.create_a_resume -> err', err);
        return res.status(400).send(err);
      }

      for (let re of req.body.School) {
        console.log(
          'exports.create_a_resume -> req.body.School)',
          req.body.School
        );
        console.log('exports.create_a_resume -> result.Id', result.Id);

        ResumeEducation.createResumEducation(
          {
            ResumeId: result.insertId,
            OkulUnvani: re.OkulUnvani,
            OkulAdresi: re.OkulAdresi,
            CreatorUserId: req.user.uid,
          },
          function (err, _result) {
            if (err) {
              console.log('exports.create_a_resume -> err', err);
              res.status(400).send(err);
            }
          }
        );
      }

      for (let re of req.body.JobTitle) {
        ResumeCompany.createResumCompany(
          {
            ResumeId: result.insertId,
            BaslamaTarihi: re.BaslamaTarihi,
            BitisTarihi: re.BitisTarihi,
            YetkiliAdi: re.YetkiliAdi,
            YetkiliTel: re.School,
            Unvan: re.Unvan,
            CreatorUserId: req.user.uid,
          },
          function (err, _result) {
            if (err) {
              console.log('exports.create_a_resume -> err', err);

              res.status(400).send(err);
            }
          }
        );
      }

      for (let re of req.body.Reference) {
        ResumeReference.createResumeReference(
          {
            ResumeId: result.insertId,
            AdSoyad: re.AdSoyad,
            Unvan: re.Unvan,
            Tel: re.Tel,
            CreatorUserId: req.user.uid,
          },
          function (err, _result) {
            if (err) {
              res.status(400).send(err);
            }
          }
        );
      }

      return res.json(result);
    });
  }
};

exports.read_a_resume = function (req, res) {
  Resume.getResumeById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_resume = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let resume = new Resume(req.body.resume);

  resume.LastModifierUserId = req.user.uid;

  Resume.updateById(req.params.Id, resume, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_resume = function (req, res) {
  Resume.remove(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
