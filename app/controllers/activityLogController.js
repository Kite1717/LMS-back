'use strict';

const jwt = require('jsonwebtoken');
var ActivityLog = require('../models/activityLogModel.js');
const { secret } = require('../../config.json');


const User = require('../models/userModel');

exports.list_all_activityLogs = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  ActivityLog.getActivityLog(req.user.companyid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};


exports.create_activity_log = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });


  console.log(req.user.companyid)
  User.getUserById(req.user.uid, function (err, result) {

    if (err) return res.send(err);
   
    var ip =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var activityLog = new ActivityLog({
      CreatorUserId: req.user.uid,
      CompanyId: req.user.companyid,
      Detail: 'Çıkış Yaptı',
      IpAddress: ip,
    });
    if(req.user.uid !== 1)
    ActivityLog.createActivityLog(activityLog, function (err, result) {

      res.send(result);
    
     });

   else   res.send([])




  });
};

exports.calculate_total_duration = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });


  console.log(req.params.Id)
 
    ActivityLog.calculateTotalDuration(req.params.Id, function (err, result) {

      res.send(result);
    
     });






};