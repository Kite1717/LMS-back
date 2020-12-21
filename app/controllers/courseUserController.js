'use strict';

const jwt = require('jsonwebtoken');
var CourseUser = require('../models/courseUserModel.js');
const { secret } = require('../../config.json');

var moment = require('moment');

exports.list_courseUsers_paged = function (req, res) {
  CourseUser.getCourseUserPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_courseUsers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getAllCourseUser(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_courseUsers_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getAllCourseUserAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_courseUsers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_courseUsers -> queryParams', queryParams);

  CourseUser.findCourseUser(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_courseUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let values = req.body.courseUser.values;
  let userList = req.body.courseUser.usersState;

  let startDate = moment(values.StartDate).format('YYYY-MM-DD');
  let endDate = moment(values.EndDate).format('YYYY-MM-DD');

  if (!values.CourseId) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    for (let u of userList) {
      let new_courseUser = {
        CreatorUserId: req.user.uid,
        StartDate: startDate,
        EndDate: endDate,
        CourseId: values.CourseId,
        UserId: u.id,
      };

      CourseUser.createCourseUser(new_courseUser, function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        res.json(result);
      });
    }
  }
};

exports.read_a_courseUser = function (req, res) {
  CourseUser.getCourseUserById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_courseUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let courseUser = new CourseUser(req.body.courseUser);

  courseUser.LastModifierUserId = req.user.uid;

  CourseUser.updateById(req.params.Id, courseUser, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_begin_end_a_end_courseUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  console.log(req.body)
  CourseUser.updateByCourseUserId(
    req.params.Id,
    req.user.uid,
    req.body.Begined,
    req.body.Finished,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.update_a_courseusers_begin_end = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.update_a_courseusers_begin_end(
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

exports.delete_a_courseUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.read_courseUser_by_userid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getCourseUserByUserId(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.getUserAllCourse = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getUserAllCourse(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};



exports.getUserAllCourseFromAdmin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getUserAllCourse(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};



exports.getUsersByUserCourseId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.getUsersByUserCourseId(req.params.Id,req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.removeByCourseIdUserId = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  CourseUser.removeByCourseIdUserId(req.params.cid, req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};
