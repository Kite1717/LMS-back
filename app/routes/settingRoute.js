'use strict';

const enums = require('../helpers/enums');

module.exports = function (app) {
  var settingController = require('../controllers/settingController');

  app.route('/api/settings').get(settingController.list_all_settings);
};
