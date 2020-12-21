'use strict';

const jwt = require('jsonwebtoken');
var CoursePackage = require('../models/coursePackageModel.js');
const { secret } = require('../../config.json');

exports.list_course_packages_paged = function (req, res) {
  CoursePackage.getCoursePackagePaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_course_packages = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CoursePackage.getAllCoursePackage(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_course_packages = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  CoursePackage.findCoursePackage(role, companyid, queryParams, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_course_package = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var coursePackage = new CoursePackage(req.body.coursePackage);

  coursePackage.CreatorUserId = req.user.uid;
  if (!coursePackage.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide Name',
    });
  } else {
    CoursePackage.createCoursePackage(coursePackage, function (err, result) {
      if (err) {
        res.status(400).send(err);
      }

      res.json(result);
    });
  }
};

exports.read_a_course_package = function (req, res) {
  CoursePackage.getCoursePackageById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_course_package = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let coursePackage = new CoursePackage(req.body.coursePackage);

  coursePackage.LastModifierUserId = req.user.uid;

  CoursePackage.updateById(req.params.Id, coursePackage, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_course_package = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CoursePackage.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) return res.send(err);
    return res.send(result);
  });
};
