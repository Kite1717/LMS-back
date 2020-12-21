'use strict';

const jwt = require('jsonwebtoken');
var Library = require('../models/libraryModel.js');
const { secret } = require('../../config.json');

exports.list_libraries_paged = function (req, res) {
  Library.getLibraryPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_libraries = function (req, res) {
  Library.getAllLibrary(function (err, result) {
    if (err) res.send(err); //test
    res.send(result);
  });
};

exports.find_libraries = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Library.findLibrary(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_library = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_library = new Library(req.body.library);
  new_library.CreatorUserId = req.user.uid;

  if (!new_library.File) {
    res.status(400).send({
      error: true,
      message: 'Please provide required fields',
    });
  } else {
    Library.createLibrary(new_library, function (err, result) {
      if (err) {
        res.send(err);
      }

      for (let item of req.body.library.libraryCategoriesState) {
        Library.createLibraryLibraryCategory(
          result.insertId,
          item.id,
          function () {}
        );
      }

      res.json(result);
    });
  }
};

exports.read_a_library = function (req, res) {
  Library.getLibraryById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.get_a_library_by_courseid = function (req, res) {
  Library.getLibraryByCourseId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.getLibraryByCourseIdCatyegoryId = function (req, res) {
  Library.getLibraryByCourseIdCatyegoryId(
    req.params.categoryid,
    req.params.courseid,
    function (err, result) {
      if (err) res.send(err);
      res.json(result);
    }
  );
};

exports.update_a_library = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let library = new Library(req.body.library);

  library.LastModifierUserId = req.user.uid;

  Library.updateById(req.params.Id, library, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_library = function (req, res) {
  Library.remove(req.params.Id, function (err, result) {
    if (err) {
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
