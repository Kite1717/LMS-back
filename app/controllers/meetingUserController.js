'use strict';

const jwt = require('jsonwebtoken');
var MeetingUser = require('../models/meetingUserModel.js');
const { secret } = require('../../config.json');

var moment = require('moment');

exports.list_meetingUsers_paged = function (req, res) {
  MeetingUser.getMeetingUserPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_meetingUsers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.getAllMeetingUser(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_meetingUsers_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.getAllMeetingUserAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_meetingUsers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_meetingUsers -> queryParams', queryParams);

  MeetingUser.findMeetingUser(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_meetingUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let values = req.body.meetingUser.values;
  let userList = req.body.meetingUser.usersState;

  if (!values.MeetingId) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    for (let u of userList) {
      let new_meetingUser = {
        CreatorUserId: req.user.uid,
        MeetingId: values.MeetingId,
        UserId: u.id,
      };

      MeetingUser.createMeetingUser(new_meetingUser, function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        res.json(result);
      });
    }
  }
};

exports.read_a_meetingUser = function (req, res) {
  MeetingUser.getMeetingUserById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_meetingUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let meetingUser = new MeetingUser(req.body.meetingUser);

  meetingUser.LastModifierUserId = req.user.uid;

  MeetingUser.updateById(req.params.Id, meetingUser, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_begin_end_a_end_meetingUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.updateByMeetingUserId(
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



/******************/
exports.get_meeting_user_assigned = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.updateByMeetingUserId(
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


/*********************** */


exports.get_users_by_meeting_id = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  console.log(req.params)
  MeetingUser.getUsersByMeetingId(req.params.Status,req.params.Id,req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};


exports.change_user_meeting_joined_status = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });


  MeetingUser.changeUserMeetingJoinedStatus(req.body.MeetingID,req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};




/***********
 * 
 */


 
exports.remove_by_meeting_id_user_id = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.removeByMeetingIdUserId(req.params.mid, req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};



exports.update_a_meetingusers_begin_end = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.upda(
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

exports.delete_a_meetingUser = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.read_meetingUser_by_userid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.getMeetingUserByUserId(req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.meeting_user_from_admin = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  MeetingUser.getMeetingUserByUserId(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};
