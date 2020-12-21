'use strict';

const jwt = require('jsonwebtoken');
var DocumentSubCategory = require('../models/documentSubCategoryModel.js');
const { secret } = require('../../config.json');

exports.list_documentSubCategories_paged = function (req, res) {
  DocumentSubCategory.getDocumentSubCategoryPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_documentSubCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentSubCategory.getAllDocumentSubCategory(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_documentSubCategories_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentSubCategory.getAllDocumentSubCategoryAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_documentSubCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  DocumentSubCategory.find_documentSubCategories(queryParams, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_documentSubCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_documentSubCategory = new DocumentSubCategory(
    req.body.qualityDocumentSubject
  );

  new_documentSubCategory.CreatorUserId = req.user.uid;
  if (!new_documentSubCategory.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    DocumentSubCategory.createDocumentSubCategory(
      new_documentSubCategory,
      function (err, result) {
        if (err) {
          res.status(400).send(err);
        }
        res.json(result);
      }
    );
  }
};

exports.read_a_documentSubCategory = function (req, res) {
  DocumentSubCategory.getDocumentSubCategoryById(req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.get_list_documentSubCategory_by_categoryid = function (req, res) {
  DocumentSubCategory.getDocumentSubCategoryByDocumentCategoryId(
    req.params.Id,
    function (err, result) {
      if (err) return res.send(err);
      return res.json(result);
    }
  );
};

exports.update_a_documentSubCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });


  
  let documentSubCategory = new DocumentSubCategory(req.body.qualityDocumentSubject);


  documentSubCategory.LastModifierUserId = req.user.uid;

  DocumentSubCategory.updateById(req.params.Id, documentSubCategory, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_documentSubCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  DocumentSubCategory.remove(req.params.Id, req.user.uid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
