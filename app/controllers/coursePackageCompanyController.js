'use strict';

const jwt = require('jsonwebtoken');
var CoursePackageCompany = require('../models/coursePackageCompanyModel.js');
const { secret } = require('../../config.json');

exports.list_all_course_packages_companys_companies = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CoursePackageCompany.getAllCoursePackageCompany(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_course_packages_companys_companies = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  CoursePackageCompany.findCoursePackageCompany(
    role,
    companyid,
    queryParams,
    function (err, result) {
      if (err) return res.send(err);
      return res.send(result);
    }
  );
};

exports.create_a_course_packages_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var CoursePackageId = req.body.coursePackageCompany.values.CoursePackageId;
  var companies = req.body.coursePackageCompany.companiesState;

  if (!CoursePackageId) {
    res.status(400).send({
      error: true,
      message: 'Please provide CoursePackageId',
    });
  } else {
    for (const c of companies) {
      console.log('exports.create_a_course_packages_company -> c', c);
      let company = new CoursePackageCompany({
        CreatorUserId: req.user.uid,
        CompanyId: c.id,
        CoursePackageId: CoursePackageId,
      });
      console.log(
        'exports.create_a_course_packages_company -> company',
        company
      );

      CoursePackageCompany.createCoursePackageCompany(company, function (
        err,
        result
      ) {
        if (err) {
          //return res.status(400).send(err);
        }
      });
    }

    return res.json('OK');
  }
};

exports.read_a_course_packages_company = function (req, res) {
  CoursePackageCompany.getCoursePackageCompanyById(req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_course_packages_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let coursePackageCompany = new CoursePackageCompany(
    req.body.coursePackageCompany
  );

  coursePackageCompany.LastModifierUserId = req.user.uid;

  CoursePackageCompany.updateById(
    req.params.Id,
    coursePackageCompany,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.delete_a_course_packages_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CoursePackageCompany.remove(req.params.Id, req.user.uid, function (
    err,
    result
  ) {
    if (err) return res.send(err);
    return res.send(result);
  });
};

exports.getCoursePackageCompanyByPackageId = function (req, res) {
  CoursePackageCompany.getCoursePackageCompanyByPackageId(
    req.params.Id,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.delete_a_course_packages_company_packaid_companyid = function (
  req,
  res
) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CoursePackageCompany.removebyPackageIdCompanyId(
    req.params.pid,
    req.params.cid,
    req.user.uid,
    function (err, result) {
      if (err) return res.send(err);
      return res.send(result);
    }
  );
};
