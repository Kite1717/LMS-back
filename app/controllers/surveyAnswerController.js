'use strict';

const jwt = require('jsonwebtoken');
var SurveyAnswer = require('../models/surveyAnswerModel.js');
var SurveyAnswerComment = require('../models/surveyAnswerCommentModel');
const { secret } = require('../../config.json');

exports.list_survey_answers_paged = function (req, res) {
  SurveyAnswer.getSurveyAnswerPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_survey_answers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyAnswer.getAllSurveyAnswer(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_survey_answers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  SurveyAnswer.findSurveyAnswer(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_survey_answer =   function   (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  for (let item of req.body.questionsAns) {

    console.log(item.A,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    if (item.Q) {
      let survey = new SurveyAnswer({
        CourseId: req.body.courseid,
        SurveyUserId: req.user.uid,
        Answer: item.A,
        SurveyQuestionId: item.Q,
        CreatorUserId: req.user.uid,
      });

  
      SurveyAnswer.createSurveyAnswer(survey, function (err, result) {
        if (err) {
          return res.status(400).send(err);
        }
      });
    }

  }

  let surveyComment = new SurveyAnswerComment({
    CourseId: req.body.courseid,
    SurveyUserId: req.user.uid,
    Comment: req.body.SurveyComment,
    CreatorUserId: req.user.uid,
  });

  SurveyAnswerComment.createSurveyAnswerComment(surveyComment, function (
    err,
    _cresult
  ) {});

  return res.json('Result:OK');
};

exports.read_a_survey_answer = function (req, res) {
  SurveyAnswer.getSurveyAnswerById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_survey_answer = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let survey = new SurveyAnswer(req.body.pollAnswer);

  survey.LastModifierUserId = req.user.uid;

  SurveyAnswer.updateById(req.params.Id, survey, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_survey_answer = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyAnswer.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_survey_by_Pollid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyAnswer.getSurveyAnswerByPollId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
