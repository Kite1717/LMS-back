'use strict';

const jwt = require('jsonwebtoken');
var Help = require('../models/helpModel.js');
const { secret } = require('../../config.json');

exports.list_helps_paged = function (req, res) {
  Help.getHelpPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_helps = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Help.getAllHelp(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_helps = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Help.findHelp(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_help = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_help = new Help(req.body.help);

  new_help.CreatorUserId = req.user.uid;

  console.log('exports.create_a_help -> new_help', new_help);

  if (!new_help.Title || !new_help.Text) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Help.createHelp(new_help, function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_help = function (req, res) {
  Help.getHelpById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_help = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let help = new Help(req.body.help);

  help.LastModifierUserId = req.user.uid;
  console.log('exports.update_a_help -> help', help);

  Help.updateById(req.params.Id, help, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_help = function (req, res) {
  Help.remove(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
