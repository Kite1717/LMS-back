'use strict';

var Setting = require('../models/settingModel.js');

exports.list_all_settings = function (req, res) {
  Setting.getAllSetting(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
