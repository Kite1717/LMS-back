'use strict';

const jwt = require('jsonwebtoken');
var VisualQuestion = require('../models/visualQuestionModel.js');
const { secret } = require('../../config.json');

var path = require('path');

exports.list_visualQuestions_paged = function (req, res) {
  VisualQuestion.getQuestionPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_visualQuestions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  VisualQuestion.getAllQuestion(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_visualQuestionstag_by_topicid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  VisualQuestion.getAllQuestionAsTag(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_visualQuestions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  VisualQuestion.findQuestions(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_visualQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var base64Data = req.body.visualQuestion.values.Image.replace(
    /^data:image\/png;base64,/,
    ''
  );
  const fs = require('fs');
  let part1 = 'img-' + Date.now() + '.png';
  let filename = '../../uploads/';
  fs.writeFile(
    path.join(__dirname, filename + part1),
    base64Data,
    'base64',
    function (err) {
      if (err) console.log('exports.create_a_visualQuestion -> err', err);
    }
  );

  var new_visualQuestion = new VisualQuestion(req.body.visualQuestion.values);
  new_visualQuestion.CreatorUserId = req.user.uid;

  new_visualQuestion.SiyahBeyaz = part1;
  new_visualQuestion.Organic = part1;
  new_visualQuestion.NonOrganic = part1;
  new_visualQuestion.Green = part1;

  if (!new_visualQuestion.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    VisualQuestion.createQuestion(new_visualQuestion, function (err, result) {
      if (err) {
        console.log('exports.create_a_visualQuestion -> err', err);
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_visualQuestion = function (req, res) {
  VisualQuestion.getQuestionById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_a_visualQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let visualQuestion = new Question(req.body.visualQuestion);

  visualQuestion.LastModifierUserId = req.user.uid;

  VisualQuestion.updateById(
    req.params.Id,
    visualQuestion,
    req.body.visualQuestion,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.delete_a_visualQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  VisualQuestion.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_a_visualQuestion_by_courseid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log(
    'exports.get_a_visualQuestion_by_courseid -> queryParams',
    queryParams
  );

  VisualQuestion.getQuestionByCourseId(queryParams, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.get_visualQuestions_by_courseid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  VisualQuestion.getAllQuestionAnswerByExamId(req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
