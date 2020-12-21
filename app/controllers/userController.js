'use strict';

const jwt = require('jsonwebtoken');
var User = require('../models/userModel.js');
var Company = require('../models/companyModel');
var ActivityLog = require('../models/activityLogModel');
const { secret } = require('../../config.json');

exports.list_users_paged = function (req, res) {
  User.getUserPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_users = function (req, res) {
  User.getAllUser(function (err, result) {
    if (err) res.send(err); //test
    res.send(result);
  });
};


exports.find_users = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  User.findUser(role, companyid, queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_users_by_tc_no = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  User.findUserByTcNo(req.body.tcNo, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });


};

exports.login_user = function (req, res) {
  var new_user = new User(req.body);

  if (!new_user.Username || !new_user.Password) {
    res.status(400).send({
      error: true,
      message: 'Please provide Username/Password',
    });
  } else {
    User.getUserByUsernamePassword(new_user, function (err, result) {
      if (err) return res.send(err);
      else if (result.Role == 1) {
        const { Password, ...userWithoutPassword } = result;

        console.log('exports.login_user -> result.Role', result.Role);

        const token = jwt.sign(
          { uid: result.Id, role: result.Role, companyid: result.CompanyId },
          secret
        );

        return res.send({
          ...userWithoutPassword,
          token,
        });
      } else {
        // eslint-disable-next-line no-unused-vars
        const { Password, ...userWithoutPassword } = result;

        console.log("asdasdasdasd","sadfdsfds")
        Company.getCompanyById(result.CompanyId, function (err, companyResult) {
          if (err) {
          
            return res.send(err);
          }
          var ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          var activityLog = new ActivityLog({
            CreatorUserId: result.Id,
            CompanyId: result.CompanyId || null,
            Detail: 'Giriş Yaptı',
            IpAddress: ip,
          });
          console.log("activityLog",activityLog)
          ActivityLog.createActivityLog(activityLog, function (err, res) {});

          const token = jwt.sign(
            { uid: result.Id, role: result.Role, companyid: result.CompanyId },
            secret
          );

          let resumeControl = companyResult[0].ResumeControl;

          return res.send({
            ...userWithoutPassword,
            token,
            ResumeControl: resumeControl,
          });
        });


      }
    });
  }
};

exports.create_a_user = function (req, res) {
  var new_user = new User(req.body.user);

  if (
    !new_user.FirstName ||
    !new_user.LastName ||
    !new_user.Role ||
    !new_user.TCNo
  ) {
    res.status(400).send({
      error: true,
      message: 'Please provide FirstName/LastName/Password/Role',
    });
  } else {
    new_user.Password = new_user.TCNo.substring(5);

    User.createUser(new_user, function (err, result) {
      if (err) {
        res.send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_user = function (req, res) {
  User.getUserById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_user = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let user = new User(req.body.user);

  user.LastUpdatedUserId = req.user.uid;

  User.updateById(req.params.Id, user, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.update_user_kvvk_phone = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let kvkk = req.body.kvkk;
  let phone = req.body.phone;

  let uid = req.user.uid;

  User.updateKvkkPhoneById(uid, kvkk, phone, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};






exports.delete_a_user = function (req, res) {
  User.remove(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_userstag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  console.log(req.user)
  User.getAllUserAsTag(req.user.companyid,function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_message_user = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  console.log(req.user)
  User.findMessageUser(req.user.role, req.user.companyid,req.user.uid, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.read_a_user_info_by_Userid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  User.getUserById(req.user.uid, function (err, result) {
    if (err) res.send(err);

    const { Password, ...userWithoutPassword } = result[0];
    res.send(userWithoutPassword);
  });
};
