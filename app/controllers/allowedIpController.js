'use strict';

const jwt = require('jsonwebtoken');
var AllowedIp = require('../models/allowedIpModel.js');
const { secret } = require('../../config.json');

exports.list_allowedIps_paged = function (req, res) {
  AllowedIp.getAllowedIpPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_allowedIps = function (req, res) {
  AllowedIp.getAllAllowedIp(function (err, result) {
    if (err) res.send(err); //test
    res.send(result);
  });
};

exports.find_allowedIps = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  AllowedIp.findAllowedIp(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_allowedIp = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_allowedIp = new AllowedIp(req.body.allowedIp);
  new_allowedIp.CreatorUserId = req.user.uid;

  if (!new_allowedIp.Ip || !new_allowedIp.CompanyId) {
    res.status(400).send({
      error: true,
      message: 'Please provide required fields',
    });
  } else {
    AllowedIp.createAllowedIp(new_allowedIp, function (err, result) {
      if (err) {
        return res.send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_allowedIp = function (req, res) {
  AllowedIp.getAllowedIpById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_allowedIp = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let allowedIp = new AllowedIp(req.body.allowedIp);

  allowedIp.LastModifierUserId = req.user.uid;

  AllowedIp.updateById(req.params.Id, allowedIp, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_allowedIp = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  AllowedIp.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) {
      console.log('exports.delete_a_allowedIp -> err', err);
      res.send(err);
    }
    res.send(result);
  });
};

exports.add_file = function (req, res) {
  try {
    const file = req.file;

    // make sure file is available
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'No file is selected.',
      });
    } else {
      res.send({
        status: true,
        message: 'File is uploaded.',
        data: {
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          filename: file.filename,
          path: file.path,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
