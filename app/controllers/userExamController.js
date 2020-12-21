'use strict';

const jwt = require('jsonwebtoken');
var UserExam = require('../models/userExamModel.js');
const { secret } = require('../../config.json');
var UserExamAnswerModel = require('../models/userExamAnswerModel');
var moment = require('moment');
const VisualExam = require('../models/visualExamModel.js');
const { read_a_resume } = require('./resumeController.js');

exports.list_userExams_paged = function (req, res) {
  UserExam.getUserExamPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_userExams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getAllUserExam(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_userExams_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getAllUserExamAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_userExams = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_userExams -> queryParams', queryParams);

  UserExam.find_userExams(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_certificates = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUserCertificates(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_certificates_from_admin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUserCertificates(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_userExam = function (req, res) {
  console.log('exports.create_a_userExam -> req', req.body);
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let values = req.body.userExam.values;
  let userList = req.body.userExam.usersState;

  let startDate = moment(values.StartDate).format('YYYY-MM-DD');
  let endDate = moment(values.EndDate).format('YYYY-MM-DD');

  let endTime = values.EndTime
  let startTime = values.StartTime


  let r;

  if (values.VisualExamId) values.ExamId = values.VisualExamId;

  if (!values.ExamId) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {

    UserExam.getUsersByExamId(values.ExamId,req.user.companyid, function (err, result) {
      if (err) res.send(err);

   
     
      for (let u of userList) {

       
      if(result.filter((value)=> value.Id === u.id ).length === 0 )
      {
          
        let new_userExam = {
          CreatorUserId: req.user.uid,
          StartDate: moment(startDate + " " + startTime).format('YYYY-MM-DD HH:mm:ss'),
          EndDate:  moment(endDate + " " + endTime).format('YYYY-MM-DD HH:mm:ss'),
          ExamStatusId: 0,
          ExamId: values.ExamId,
          UserId: u.id,
          MinSuccessRate: values.MinSuccessRate,
        };
  
        UserExam.createUserExam(new_userExam, function (err, result) {
          r = result;
        });
      }
        
      }
  
      return res.send(r);

      
    });
  
  }
};

exports.read_a_userExam = function (req, res) {
  UserExam.getUserExamById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_userExam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let userExam = new UserExam(req.body.userExam);

  userExam.LastModifierUserId = req.user.uid;

  UserExam.updateById(req.params.Id, userExam, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_a_userExam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.updateByExamCode(
    req.params.Id,
    req.user.uid,
    req.body.begined,
    req.body.finished,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.delete_a_userExam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.read_userExam_by_userid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUserExamById(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.getUsersAllExam = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUsersAllExam(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.getUserAllExamsFromAdmin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUsersAllExam(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};



exports.getUserExamsAnswersFromAdmin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUserExamAnswerById(req.params.Id,req.params.ExamId, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.getUsersByExamId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.getUsersByExamId(req.params.Id,req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};



exports.removeByExamIdUserId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExam.removeByExamIdUserId(req.params.eid, req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
