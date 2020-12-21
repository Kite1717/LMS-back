'use strict';

const jwt = require('jsonwebtoken');
var DocumentCategory = require('../models/documentCategoryModel.js');
const { secret } = require('../../config.json');

exports.list_documentCategories_paged = function (req, res) {
  DocumentCategory.getDocumentCategoryPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_documentCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentCategory.getAllDocumentCategory(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_documentCategories_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentCategory.getAllDocumentCategoryAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_documentCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  DocumentCategory.findDocumentCategories(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_documentCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_documentCategory = new DocumentCategory(req.body.qualityDocument);

  new_documentCategory.CreatorUserId = req.user.uid;
  if (!new_documentCategory.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    DocumentCategory.createDocumentCategory(new_documentCategory, function (
      err,
      result
    ) {
      if (err) {
        res.status(400).send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_documentCategory = function (req, res) {
  DocumentCategory.getDocumentCategoryById(req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_documentCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let documentCategory = new DocumentCategory(req.body.qualityDocument);

  documentCategory.LastModifierUserId = req.user.uid;

  DocumentCategory.updateById(req.params.Id, documentCategory, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_documentCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentCategory.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
