'use strict';

const jwt = require('jsonwebtoken');
var Meeting = require('../models/meetingModel.js');
const { secret } = require('../../config.json');
const { v4: uuidv4 } = require('uuid');
var moment = require('moment');
const create = require('../helpers/bbb-create');
const moderator = require('../helpers/bbb-moderator');

var { GetAllEvents } = require('../models/eventCalendarModel');

exports.list_meetings_paged = function (req, res) {
  Meeting.getMeetingPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_meetings = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Meeting.getAllMeeting(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_meetings = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_meetings -> queryParams', queryParams);

  Meeting.findMeeting(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_meeting = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_meeting = new Meeting(req.body.meeting);

  new_meeting.CreatorUserId = req.user.uid;
  new_meeting.MeetingID = uuidv4();

  new_meeting.StartTime =
    moment(new_meeting.StartDate).format('YYYY-MM-DD') +
    ' ' +
    new_meeting.StartTime;

  new_meeting.EndTime =
    moment(new_meeting.EndDate).format('YYYY-MM-DD') +
    ' ' +
    new_meeting.EndTime;

  new_meeting.AttendeePW = Math.floor(Math.random() * 1000) + 1;
  new_meeting.ModeratorPW = Math.floor(Math.random() * 10000) + 1001;

 
  if (
    !new_meeting.CompanyId ||
    !new_meeting.MeetingName ||
    !new_meeting.StartTime ||
    !new_meeting.EndTime
  ) {

   
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Meeting.createMeeting(new_meeting, function (err, result) {
      if (err) {
        console.log('exports.create_a_meeting -> err', err);
        return res.send(err);
      }
      console.log('exports.create_a_meeting -> result', result);

      /*
      create(
        new_meeting.AttendeePW,
        new_meeting.MeetingID,
        new_meeting.ModeratorPW,
        new_meeting.MeetingName
      );
      */

      return res.json(result);
    });
  }
};

exports.read_a_meeting = function (req, res) {
  Meeting.getMeetingById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_meeting = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let meeting = new Meeting(req.body.meeting);

  meeting.LastModifierUserId = req.user.uid;
  meeting.StartTime =
    moment(meeting.StartDate).format('YYYY-MM-DD') + ' ' + meeting.StartTime;

  meeting.EndTime =
    moment(meeting.EndDate).format('YYYY-MM-DD') + ' ' + meeting.EndTime;

  Meeting.updateById(req.params.Id, meeting, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_meeting = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Meeting.remove(req.params.Id, function (err, result) {
    if (err) {
      console.log('exports.delete_a_meeting -> err', err);
      return res.send(err);
    }
    return res.send(result);
  });
};

exports.get_moderator_link = function (req, res) {
  Meeting.getMeetingByMeetingId(req.params.meeetingid, function (
    err,
    mettingResult
  ) {
    if (err) {
      console.log('exports.delete_a_meeting -> err', err);
      return res.send(err);
    }

    create(
      mettingResult.AttendeePW,
      mettingResult.MeetingID,
      mettingResult.ModeratorPW,
      mettingResult.MeetingName,
      function (err, createResult) {
        return res.send(
          moderator('moderator', req.params.meeetingid, req.params.pass)
        );
      }
    );
  });
};

exports.get_attendee_link = function (req, res) {
  return res.send(
    moderator(req.params.name, req.params.meeetingid, req.params.pass)
  );
};

exports.GetAllEvents = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  GetAllEvents(function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};
