'use strict';

const jwt = require('jsonwebtoken');
var HelpCategory = require('../models/helpCategoryModel.js');
const { secret } = require('../../config.json');

exports.list_all_helpCategories = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  HelpCategory.getAllHelpCategory(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
