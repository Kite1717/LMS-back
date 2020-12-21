'use strict';

const jwt = require('jsonwebtoken');
var Survey = require('../models/surveyModel.js');
const { secret } = require('../../config.json');

exports.list_surveys_paged = function (req, res) {
  Survey.getSurveyPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_surveys = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getAllSurvey(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_surveys = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Survey.findSurvey(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_survey = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_survey = new Survey(req.body.poll);

  new_survey.CreatorUserId = req.user.uid;

  if (!new_survey.CourseId || !new_survey.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Survey.createSurvey(new_survey, function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_survey = function (req, res) {
  Survey.getSurveyById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_survey = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let survey = new Survey(req.body.poll);

  survey.LastModifierUserId = req.user.uid;

  Survey.updateById(req.params.Id, survey, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_survey = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_survey_by_courseid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getSurveyByCourseId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.getSurveyByUserCourseCode = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getSurveyByUserCourseCode(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.surveysUserAnswerById = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getSurveysUserAnswerById(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};


exports.surveysAllAnswerStattisticByCourseId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getSurveysAllAnswerStattisticByCourseId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};





exports.courseSurveyAnswersByUserId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getCourseSurveyAnswersByUserId(req.params.id,req.params.courseId, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};


exports.userSurveyCommentByUserIdAndCourseId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Survey.getUserSurveyCommentByUserIdAndCourseId(req.params.id,req.params.courseId, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};









