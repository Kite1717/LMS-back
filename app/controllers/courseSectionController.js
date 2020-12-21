'use strict';

const jwt = require('jsonwebtoken');
var CourseSection = require('../models/courseSectionModel.js');
const { secret } = require('../../config.json');

const fileTypeHandler = require('../helpers/file-type-handler');

exports.list_course_sections_paged = function (req, res) {
  CourseSection.getCourseSectionPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_courseSections = function (req, res) {
  CourseSection.getAllCourseSection(function (err, result) {
    if (err) res.send(err); //test
    res.send(result);
  });
};

exports.find_courseSections = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  CourseSection.findCourseSection(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_courseSection = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_courseSection = new CourseSection(req.body.courseSection);

  new_courseSection.CreatorUserId = req.user.uid;

  new_courseSection.CourseType = fileTypeHandler(new_courseSection.FileOrUrl);

  if (
    !new_courseSection.Name ||
    !new_courseSection.TopicId ||
    !new_courseSection.FileOrUrl ||
    !new_courseSection.CourseTypeId
  ) {
    res.status(400).send({
      error: true,
      message: 'Please provide required fields',
    });
  } else {
    CourseSection.createCourseSection(new_courseSection, function (
      err,
      result
    ) {
      if (err) {
        console.log('exports.create_a_courseSection -> err', err);
        res.send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_courseSection = function (req, res) {
  CourseSection.getCourseSectionById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_courseSection = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let courseSection = new CourseSection(req.body.courseSection);

  courseSection.LastModifierUserId = req.user.uid;

  CourseSection.updateById(req.params.Id, courseSection, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_courseSection = function (req, res) {
  CourseSection.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.add_file = function (req, res) {
  try {
    const file = req.file;

    // make sure file is available
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'No file is selected.',
      });
    } else {
      res.send({
        status: true,
        message: 'File is uploaded.',
        data: {
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          filename: file.filename,
          path: file.path,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
