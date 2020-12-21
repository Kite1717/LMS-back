'use strict';

const jwt = require('jsonwebtoken');
var ExamQuestion = require('../models/examQuestionModel.js');
var Exam = require('../models/examModel.js');
const { secret } = require('../../config.json');

exports.list_examQuestions_paged = function (req, res) {
  ExamQuestion.getExamQuestionPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_examQuestions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  ExamQuestion.getAllExamQuestion(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_examQuestions_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  ExamQuestion.getAllExamQuestionAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_examQuestions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_examQuestions -> queryParams', queryParams);

  ExamQuestion.findExamQuestion(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_examQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_examQuestion = new ExamQuestion(req.body.examQuestion);

  new_examQuestion.CreatorUserId = req.user.uid;
  if (
    !new_examQuestion.ExamQuestionTypeId ||
    !new_examQuestion.FullName ||
    !new_examQuestion.ShortName ||
    !new_examQuestion.TaxNumber ||
    !new_examQuestion.TaxAdministration ||
    !new_examQuestion.Address ||
    !new_examQuestion.Phone ||
    !new_examQuestion.RelevantPersonFullName ||
    !new_examQuestion.RelevantPersonEmail ||
    !new_examQuestion.RelevantPersonPhone ||
    !new_examQuestion.ContractStartDate ||
    !new_examQuestion.ContractEndDate
  ) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    ExamQuestion.createExamQuestion(new_examQuestion, function (err, result) {
      if (err) {
        console.log('exports.create_a_examQuestion -> err', err);
        res.status(400).send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_examQuestion = function (req, res) {
  ExamQuestion.getExamQuestionById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.get_examQuestion_by_exam_code = function (req, res) {
  let jsonResult = [];

  ExamQuestion.getExamQuestionByExamId(req.params.Id, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      let i = 0;
      let q = {};
      let answers = [];

      //sadadasd
      for (let r of result) {
        if (i % 4 == 0) {
          q = { qid: r.Id, qText: r.Text };
        }
        i++;

        answers.push({ qid: r.AnswerId, aText: r.answer });

        if (i % 4 == 0) {
          q.a = answers;
          jsonResult.push(q);
          q = {};
          answers = [];
        }
      }

      Exam.getExamByExamCode(req.params.Id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          result[0].qa = jsonResult;
          return res.json(result[0]);
        }
      });
    }
  });
};

exports.get_visual_examQuestion_by_exam_code = function (req, res) {
  let jsonResult = [];

  ExamQuestion.getVisualExamQuestionByExamId(req.params.Id, function (
    err,
    resultq
  ) {
    if (err) {
      res.send(err);
    } else {
      Exam.getExamByExamCode(req.params.Id, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          result[0].qa = resultq;
          return res.json(result[0]);
        }
      });
    }
  });
};

exports.update_a_examQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let examQuestion = new ExamQuestion(req.body.examQuestion);

  examQuestion.LastModifierUserId = req.user.uid;

  ExamQuestion.updateById(req.params.Id, examQuestion, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_examQuestion = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  ExamQuestion.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_a_examQuestion_by_examId = function (req, res) {
  ExamQuestion.getExamQuestionsByExamId(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};
