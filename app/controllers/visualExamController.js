'use strict';

const jwt = require('jsonwebtoken');
var Exam = require('../models/visualExamModel.js');
const { secret } = require('../../config.json');
var ExamQuestion = require('../models/examQuestionModel');

exports.list_visual_exams_paged = function (req, res) {
  Exam.getExamPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_visual_exams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.getAllExam(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_visual_exams_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.getAllExamAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_visual_exams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.uid;
  let companyid = req.user.companyid;

  Exam.findExam(role, companyid, queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

//

exports.visual_exams_answers_from_admin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });



  Exam.answersOfVisualExam(req.params.Id,req.params.ExamId, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_visual_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let new_visual_exam = new Exam(req.body.visualExam.values);
  let questionList = req.body.visualExam.visualQuestionsState;

  new_visual_exam.CreatorUserId = new_visual_exam.TopicId =
    req.body.visualExam.topicIdState;
  new_visual_exam.CourseId = req.body.visualExam.courseIdState;
  new_visual_exam.CompanyId = req.user.companyid;

  if (!new_visual_exam.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Exam.createVisualExam(new_visual_exam, function (err, result) {
      if (err) {
        console.log('exports.create_a_visual_exam -> err', err);
        return res.status(400).send(err);
      } else {
        console.log('exports.create_a_visual_exam -> result', result);
        let questions = []
        for (let q of questionList) {

          questions.push({
            ExamId: result.Id,
            QuestionId: q.id,
            CreatorUserId: req.user.uid,

          })

          ExamQuestion.createExamQuestion(
           questions,
            function (err, eqResult) {
              if (err) {
                console.log('exports.create_a_visual_exam -> err', err);
                //res.status(400).send(err);
              }
            }
          );
        }
        return res.json(result);
      }
    });
  }
};

exports.read_a_visual_exam = function (req, res) {
  Exam.getExamById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_visual_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let exam = new Exam(req.body.exam);

  exam.LastModifierUserId = req.user.uid;

  Exam.updateById(req.params.Id, exam, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_visual_exam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Exam.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
