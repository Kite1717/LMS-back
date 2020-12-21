'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');

var Setting = function (setting) {
  this.Id = setting.Id;
  this.Title = setting.Title;
  this.Value = setting.Value;
};

Setting.getAllSetting = function (callback) {
  pool
    .query('SELECT *  from setting   ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Setting;
