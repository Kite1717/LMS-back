'use strict';

const jwt = require('jsonwebtoken');
var Company = require('../models/companyModel.js');
const { secret } = require('../../config.json');

exports.list_companies_paged = function (req, res) {
  Company.getCompanyPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_companies = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let role = req.user.role;
  let companyid = req.user.companyid;

  Company.getAllCompany(role, companyid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_companies_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Company.getAllCompanyAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_companies = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  let role = req.user.role;
  let companyid = req.user.companyid;

  Company.findCompany(role, companyid, queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_company = new Company(req.body.company);

  new_company.CreatorUserId = req.user.uid;
  if (
    !new_company.CompanyTypeId ||
    !new_company.FullName ||
    !new_company.ShortName ||
    !new_company.TaxNumber ||
    !new_company.TaxAdministration ||
    !new_company.Address ||
    !new_company.Phone ||
    !new_company.RelevantPersonFullName ||
    !new_company.RelevantPersonEmail ||
    !new_company.RelevantPersonPhone ||
    !new_company.ContractStartDate ||
    !new_company.ContractEndDate
  ) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Company.createCompany(new_company, function (err, result) {
      if (err) {
        res.status(400).send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_company = function (req, res) {
  Company.getCompanyById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let company = new Company(req.body.company);

  company.LastModifierUserId = req.user.uid;

  Company.updateById(req.params.Id, company, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_company = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Company.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
