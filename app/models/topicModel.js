'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Topic = function (topic) {
  this.Id = topic.Id;
  this.IsPublished = topic.IsPublished;
  this.IsDeleted = topic.IsDeleted;
  this.CreatorUserId = topic.CreatorUserId;
  this.CreatedAt = topic.CreatedAt;
  this.LastModifierUserId = topic.LastModifierUserId;
  this.UpdatedAt = topic.UpdatedAt;
  this.DeleterUserId = topic.DeleterUserId;
  this.DeletedAt = topic.DeletedAt;

  this.Name = topic.Name;
  this.CourseId = topic.CourseId;
};

Topic.createTopic = function (newTopic, callback) {
  pool
    .query(
      'INSERT INTO topic (IsPublished,CreatorUserId,CreatedAt,Name, CourseId ) values (?,?,?,?,?)',
      [
        newTopic.IsPublished || null,
        newTopic.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newTopic.Name,
        newTopic.CourseId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.findTopic = function (queryParams, callback) {
  console.log('Topic.findTopic -> queryParams', queryParams);
  let sql =
    'SELECT  COUNT(Id) as totalCount  from topic where  IsDeleted is null ';
  let sql2 = 'SELECT  * from topic where IsDeleted is null ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  if (queryParams.filter.CourseId || queryParams.filter.CourseId != '') {
    sql += ' and CourseId = ?';
    params.push(queryParams.filter.CourseId);

    sql2 += ' and CourseId = ?';
    params2.push(queryParams.filter.CourseId);
  }

  sql2 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  pool
    .query(sql, params)
    .then((res) => {
      let totalCount = res[0].totalCount;
      pool.query(sql2, params2).then((res) => {
        let data = {
          entities: res,
          totalCount: totalCount,
        };
        return callback(null, data);
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.getTopicPaged = function (req, callback) {
  let Pagination = require('../topicers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/topics/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from topic ')
    .then((res) => {
      const perPage = 10,
        totalCount = res[0].totalCount;

      const Paginate = new Pagination(
        totalCount,
        currentPage,
        pageUri,
        perPage
      );

      pool
        .query(
          'SELECT (SELECT count(*) from topic)  as linecount, b.*  from topic b LIMIT ' +
            Paginate.perPage +
            ' OFFSET ' +
            Paginate.offset
        )
        .then((res) => {
          let data = {
            items: res,
            pages: Paginate.links(),
          };

          return callback(null, data);
        });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.getTopicById = function (id, callback) {
  pool
    .query('Select x.* from topic x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.getAllTopic = function (callback) {
  pool
    .query('SELECT *  from topic ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Topic.getAllTopic -> err', err);

      return callback(err, null);
    });
};

Topic.getTopicsByCourseId = function (courseId, callback) {
  pool
    .query('SELECT *  from topic where CourseId=?  and IsDeleted is null', [
      courseId,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE topic SET IsDeleted = true, DeletedAt=?, DeleterUserId=? WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Topic.updateById = function (id, topic, callback) {
  topic.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE topic SET  ';

  if (topic.Name) {
    sql += ' Name=?,';
    params.push(topic.Name);
  }

  if (topic.CourseId) {
    sql += ' CourseId=?,';
    params.push(topic.CourseId);
  }

  if (topic.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(topic.UpdatedAt);
  }

  if (topic.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(topic.LastModifierUserId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Topic;
