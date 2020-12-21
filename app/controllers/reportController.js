'use strict';

var Report = require('../models/reportModel');

exports.TotalUserCount = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });
 
  let companyId  = (req.user.role == 1) ? 0 : req.user.companyid;

  
console.log(companyId)
  Report.totalUserCount(companyId, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};



exports.All_exam_success_rate_by_user = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.ExamSuccessRateById(req.user.uid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};



exports.Very_easy_visual_questions = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.VeryEasyVisualQuestions( function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};


exports.Theorical_question_count_by_course = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.theorical_question_count_by_course(req.user.companyid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.Visual_question_count_by_course = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.visual_question_count_by_course(req.user.companyid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.Total_library_count_by_course_category = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.total_library_count_by_course_category(req.user.companyid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.motnhly_created_library = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.motnhly_created_library(req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.total_created_certificates = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let role = req.user.role;
  console.log('exports.total_created_certificates -> role', role);
  let companyid = req.user.companyid;
  console.log('exports.total_created_certificates -> companyid', companyid);

  Report.total_created_certificates(companyid, role, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.motnhly_libraries_enddate = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.motnhly_libraries_enddate(req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.findUserMessages = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  Report.user_message_by_userid(role, companyid, queryParams, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.course_usage_report = function (req, res) {
  console.log('exports.exam_result_report -> req.params', req.params);
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.course_usage_report(
    req.params.courseid,
    req.params.companyid,
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    }
  );
};



exports.filter_by_course_usage_report = function (req, res) {
  console.log('exports.exam_result_report -> req.params', req.params);
  if (!req.user) return res.status(400).send({ message: 'member not found' });
  console.log( req.body)

  Report.filterByCourseUsageReport(
    req.params.courseid,
    req.params.companyid,
    req.body.begined,
    req.body.finised,
    function (err, result) {
      if (err) res.send(err);
      res.send(result);
    }
  );
};

exports.exam_result_report = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.exam_result_report(req.params.examid, req.params.companyid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};



exports.filter_by_exam_result_report = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.filterByExamResultReport(req.params.examid, req.params.companyid,req.body.begined,req.body.finised, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};


exports.course_calendar = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Report.course_calendar(req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
