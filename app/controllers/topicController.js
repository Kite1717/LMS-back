'use strict';

const jwt = require('jsonwebtoken');
var Topic = require('../models/topicModel.js');
var CourseSection = require('../models/courseSectionModel');
const { secret } = require('../../config.json');

exports.list_topics_paged = function (req, res) {
  Topic.getTopicPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_topics = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Topic.getAllTopic(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_topics_by_courseid = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Topic.getTopicsByCourseId(req.params.id, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

function endOfCalls(res, Clone) {
  return res.send(Clone);
}

exports.list_topics_by_courseid_with_sections = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Topic.getTopicsByCourseId(req.params.id, function (err, result) {
    if (err) res.send(err);
    else {
      var Clone = [];

      var itemsProcessed = 0;

      result.map((r) => {
        CourseSection.getCourseSectionByTopicId(r.Id, r, function (
          err,
          result2
        ) {
          if (result2.gs.length > 0) Clone.push(result2);

          itemsProcessed++;

          if (itemsProcessed >= result.length) {
            endOfCalls(res, Clone);
          }
        });
      });
    }
  });
};

exports.find_topics = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;

  Topic.findTopic(queryParams, function (err, result) {
    if (err) {
      return res.send(err);
    }

    return res.send(result);
  });
};

exports.create_a_topic = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var new_topic = new Topic(req.body.topic);

  new_topic.CreatorUserId = req.user.uid;

  if (!new_topic.CourseId || !new_topic.Name) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    Topic.createTopic(new_topic, function (err, result) {
      if (err) {
        res.status(400).send(err);
      }
      res.json(result);
    });
  }
};

exports.read_a_topic = function (req, res) {
  Topic.getTopicById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_topic = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let topic = new Topic(req.body.topic);

  topic.LastModifierUserId = req.user.uid;

  Topic.updateById(req.params.Id, topic, function (err, result) {
    if (err) {
      res.send(err);
    }
    res.json(result);
  });
};

exports.delete_a_topic = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  Topic.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
