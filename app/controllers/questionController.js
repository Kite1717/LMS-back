'use strict';

const jwt = require('jsonwebtoken');
var Question = require('../models/questionModel.js');
const { secret } = require('../../config.json');

exports.list_questions_paged = function (req, res) {
  Question.getQuestionPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_questions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Question.getAllQuestion(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_questionstag_by_topicid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Question.getAllQuestionAsTag(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_questions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Question.findQuestions(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

//Allaha emanet create function

exports.create_a_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let t = req.body.question.TopicId.topicId;

  var new_question = new Question({
    Text: req.body.question.Text,
    TopicId: t,
    CreatorUserId: req.user.uid,
    IsSectionEndQuestion: req.body.question.Text, // TODO: check this
  });

  if (!new_question.Text) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Question.createQuestion(new_question, req.body, function (err, result) {
      if (err) {
        //return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_question = function (req, res) {
  Question.getQuestionById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_a_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let question = new Question(req.body.question);

  question.LastModifierUserId = req.user.uid;

  Question.updateById(req.params.Id, question, req.body.question, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_question = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Question.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_a_quesyion_by_courseid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Question.getQuestionByCourseId(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
