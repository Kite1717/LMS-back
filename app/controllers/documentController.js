'use strict';

const jwt = require('jsonwebtoken');
var Document = require('../models/documentModel.js');
const { secret } = require('../../config.json');

exports.list_course_sections_paged = function (req, res) {
  Document.getDocumentPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_documents = function (req, res) {
  Document.getAllDocument(function (err, result) {
    if (err) res.send(err); //test
    res.send(result);
  });
};

exports.find_documents = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  queryParams.filter.CompanyId = req.user.companyid;

  Document.findDocument(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_document = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_document = new Document(req.body.qualityDocumentFile);

  new_document.CreatorUserId = req.user.uid;
  new_document.CompanyId = req.user.companyid;

  if (!new_document.File) {
    res.status(400).send({
      error: true,
      message: 'Please provide required fields',
    });
  } else {
    Document.createDocument(new_document, function (err, result) {
      if (err) {
        res.send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_document = function (req, res) {
  Document.getDocumentById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_document = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let document = new Document(req.body.document);

  document.LastModifierUserId = req.user.uid;

  Document.updateById(req.params.Id, document, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_document = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Document.remove(req.params.Id, function (err, result) {
    if (err) res.send(err);
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
