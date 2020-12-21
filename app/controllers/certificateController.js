'use strict';

const jwt = require('jsonwebtoken');
var Certificate = require('../models/certificateModel');
const { secret } = require('../../config.json');

exports.findCertificate = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.uid;
  let companyid = req.user.companyid;

  Certificate.findCertificate(role, companyid, queryParams, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.send(result);
  });
};
