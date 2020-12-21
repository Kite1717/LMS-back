'use strict';

const jwt = require('jsonwebtoken');
var BulkFile = require('../models/bulkFileModel.js');
const { secret } = require('../../config.json');

exports.find_bulkFiles = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  BulkFile.findBulkFile(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_bulkFile = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_bulkFile = new BulkFile(req.body.bulkFile);
  new_bulkFile.CreatorUserId = req.user.uid;

  if (req.body.bulkFile.TopicId) {
    new_bulkFile.TopicId = parseInt(req.body.bulkFile.TopicId.topicId);
  }

  if (req.body.bulkFile.CompanyId) {
    new_bulkFile.CompanyId = parseInt(req.body.bulkFile.CompanyId);
  }

  if (!new_bulkFile.File) {
    res.status(400).send({
      error: true,
      message: 'Please provide required fields',
    });
  } else {
    BulkFile.createBulkFile(new_bulkFile, function (err, result) {
      if (err) {
        console.log('exports.create_a_bulkFile -> err', err);
        res.send(err);
      }

      res.json(result);
    });
  }
};

exports.add_file = function (req, res) {
  try {
    const file = req.file;

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
