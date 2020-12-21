'use strict';

const jwt = require('jsonwebtoken');
var Course = require('../models/courseModel.js');
const { secret } = require('../../config.json');

exports.list_courses_paged = function (req, res) {
  Course.getCoursePaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_courses = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Course.getAllCourse(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_courses = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_courses -> queryParams', queryParams);

  Course.findCourse(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_course = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_course = new Course(req.body.course);

  new_course.CreatorUserId = req.user.uid;

  if (
    !new_course.CoursePackageId ||
    !new_course.Name ||
    !new_course.Description ||
    !new_course.Duration
  ) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Course.createCourse(new_course, function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_course = function (req, res) {
  Course.getCourseById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_course = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let course = new Course(req.body.course);

  course.LastModifierUserId = req.user.uid;
  console.log('exports.update_a_course -> course', course);

  Course.updateById(req.params.Id, course, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_course = function (req, res) {
  console.log('exports.delete_a_course -> req', req);
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Course.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
