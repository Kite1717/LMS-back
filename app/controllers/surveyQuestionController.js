'use strict';

const jwt = require('jsonwebtoken');
var SurveyQuestion = require('../models/surveyQuestionModel.js');
const { secret } = require('../../config.json');

exports.list_survey_questions_paged = function (req, res) {
  SurveyQuestion.getSurveyGroupPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_survey_questions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyQuestion.getAllSurveyQuestion(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_survey_questions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  SurveyQuestion.findSurveyQuestion(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_survey_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_survey_question = new SurveyQuestion(req.body.pollQuestion);

  console.log(
    'exports.create_a_survey_question -> req.body',
    new_survey_question
  );

  new_survey_question.CreatorUserId = req.user.uid;

  if (!new_survey_question.SurveyGroupId || !new_survey_question.Question) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    SurveyQuestion.createSurveyQuestion(new_survey_question, function (
      err,
      result
    ) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_survey_question = function (req, res) {
  SurveyQuestion.getSurveyQuestionById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_survey_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let survey = new SurveyQuestion(req.body.pollQuestion);

  survey.LastModifierUserId = req.user.uid;
  console.log('exports.update_a_survey_question -> survey', survey);

  SurveyQuestion.updateById(req.params.Id, survey, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_survey_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyQuestion.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_questions_by_PollGroupid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyQuestion.getSurveyQuestionByPollGroupId(req.params.id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
