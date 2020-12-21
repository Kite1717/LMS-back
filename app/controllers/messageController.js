'use strict';

const jwt = require('jsonwebtoken');
var Message = require('../models/messageModel.js');
const { secret } = require('../../config.json');
const { v4: uuidv4 } = require('uuid');
var moment = require('moment');
const create = require('../helpers/bbb-create');
const moderator = require('../helpers/bbb-moderator');

exports.list_messages_paged = function (req, res) {
  Message.getMessagePaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_messages = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Message.getAllMessage(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_messages = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Message.findMessage(req.user.uid, queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.viewing_message = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Message.viewMessage(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_message = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  console.log(req.user)
  var new_message = new Message(req.body.message);
  new_message.CreatorUserId = req.user.uid;

  if (!new_message.Text) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Message.createMesssage(new_message, function (err, result) {
      if (err) {
     
        return res.status(400).send(err);
      }
      return res.json(result);
    });
  }
};

exports.read_a_message = function (req, res) {
  Message.getMessageById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_message = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let message = new Message(req.body.message);

  message.LastModifierUserId = req.user.uid;
  message.StartTime =
    moment(message.StartDate).format('YYYY-MM-DD') + ' ' + message.StartTime;

  message.EndTime =
    moment(message.EndDate).format('YYYY-MM-DD') + ' ' + message.EndTime;

  Message.updateById(req.params.Id, message, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_message = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Message.remove(req.params.Id, function (err, result) {
    if (err) {
      console.log('exports.delete_a_message -> err', err);
      return res.send(err);
    }
    return res.send(result);
  });
};

exports.get_moderator_link = function (req, res) {
  return res.send(
    moderator('moderator', req.params.meeetingid, req.params.pass)
  );
};

exports.get_attendee_link = function (req, res) {
  return res.send(
    moderator(req.params.name, req.params.meeetingid, req.params.pass)
  );
};
