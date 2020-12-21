'use strict';

const jwt = require('jsonwebtoken');
var Exam = require('../models/examModel.js');
const { secret } = require('../../config.json');
var ExamQuestion = require('../models/examQuestionModel');

exports.list_exams_paged = function (req, res) {
  Exam.getExamPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_exams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.getAllExam(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_exams_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.getAllExamAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_exams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  Exam.findExam(role, companyid, queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let new_exam = new Exam(req.body.exam.values);

  let questionList = req.body.exam.questionsState;

  new_exam.CreatorUserId = new_exam.TopicId = req.body.exam.topicIdState;
  new_exam.CourseId = req.body.exam.courseIdState;
  new_exam.CompanyId = req.user.companyid;

  if (!new_exam.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Exam.createExam(new_exam, function (err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        let questions = []
        for (let q of questionList) {
          questions.push({
            ExamId: result.Id,
            QuestionId: q.id,
            CreatorUserId: req.user.uid,

          })

         
        }

        ExamQuestion.createExamQuestion(
          questions,

       
         function (err, eqResult) {
           if (err) {
             //res.status(400).send(err);
           }
         }
       );
        res.json(result);
      }
    });
  }
};

exports.read_a_exam = function (req, res) {
  Exam.getExamById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let new_exam = new Exam(req.body.exam.values);

  let questionList = req.body.exam.questionsState;

  new_exam.LastModifierUserId = new_exam.TopicId = req.body.exam.topicIdState;
  new_exam.CourseId = req.body.exam.courseIdState;
  new_exam.CompanyId = req.user.companyid;

  if (!new_exam.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Exam.updateById(req.params.Id, new_exam, function (err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        for (let q of questionList) {
          ExamQuestion.createExamQuestion(
            {
              ExamId: new_exam.Id,
              QuestionId: q.id,
              CreatorUserId: req.user.uid,
            },
            function (err, eqResult) {
              if (err) {
                //res.status(400).send(err);
              }
            }
          );
        }
        res.json(result);
      }
    });
  }

  /*
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let exam = new Exam(req.body.exam);

  exam.LastModifierUserId = req.user.uid;

  Exam.updateById(req.params.Id, exam, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
  */
};

exports.delete_a_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
