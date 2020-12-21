'use strict';

const jwt = require('jsonwebtoken');
var LibraryCategory = require('../models/libraryCategoryModel.js');
const { secret } = require('../../config.json');

exports.list_libraryCategories_paged = function (req, res) {
  LibraryCategory.getLibraryCategoryPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_libraryCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  LibraryCategory.getAllLibraryCategory(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_libraryCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_libraryCategories -> queryParams', queryParams);

  LibraryCategory.findLibraryCategory(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_libraryCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });
  console.log('exports.create_a_libraryCategory -> req.body', req.body);

  var new_libraryCategory = new LibraryCategory(req.body.libraryCategory);

  new_libraryCategory.CreatorUserId = req.user.uid;

  if (!new_libraryCategory.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    LibraryCategory.createLibraryCategory(new_libraryCategory, function (
      err,
      result
    ) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_libraryCategory = function (req, res) {
  LibraryCategory.getLibraryCategoryById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_libraryCategory = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let libraryCategory = new LibraryCategory(req.body.libraryCategory);

  libraryCategory.LastModifierUserId = req.user.uid;

  LibraryCategory.updateById(req.params.Id, libraryCategory, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_libraryCategory = function (req, res) {
  LibraryCategory.remove(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_library_Categoriestag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  LibraryCategory.getAllLibraryCategoriesAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.getAllLibraryByCategories = function (req, res) {
  LibraryCategory.getAllLibraryByCategories(req.params.Id, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
