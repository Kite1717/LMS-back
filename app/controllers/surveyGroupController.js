'use strict';

const jwt = require('jsonwebtoken');
var SurveyGroup = require('../models/surveyGroupModel.js');
const { secret } = require('../../config.json');

exports.list_survey_groups_paged = function (req, res) {
  SurveyGroup.getSurveyGroupPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_survey_groups = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyGroup.getAllSurveyGroup(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_survey_groups = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  SurveyGroup.findSurveyGroup(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_survey_group = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_survey_group = new SurveyGroup(req.body.pollGroup);

  new_survey_group.CreatorUserId = req.user.uid;

  if (!new_survey_group.SurveyId || !new_survey_group.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    SurveyGroup.createSurveyGroup(new_survey_group, function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json(result);
    });
  }
};

exports.read_a_survey_group = function (req, res) {
  SurveyGroup.getSurveyGroupById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_survey_group = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let survey = new SurveyGroup(req.body.pollGroup);

  survey.LastModifierUserId = req.user.uid;

  SurveyGroup.updateById(req.params.Id, survey, function (err, result) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_survey_group = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyGroup.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.get_survey_by_Pollid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  SurveyGroup.getSurveyGroupByPollId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
