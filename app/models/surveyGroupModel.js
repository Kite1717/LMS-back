'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var SurveyGroup = function (survey_group) {
  this.Id = survey_group.Id;
  this.IsPublished = survey_group.IsPublished;
  this.IsDeleted = survey_group.IsDeleted;
  this.CreatorUserId = survey_group.CreatorUserId;
  this.CreatedAt = survey_group.CreatedAt;
  this.LastModifierUserId = survey_group.LastModifierUserId;
  this.UpdatedAt = survey_group.UpdatedAt;
  this.DeleterUserId = survey_group.DeleterUserId;
  this.DeletedAt = survey_group.DeletedAt;

  this.Name = survey_group.Name;
  this.SurveyId = survey_group.SurveyId;
};

SurveyGroup.createSurveyGroup = function (newSurveyGroup, callback) {
  pool
    .query(
      'INSERT INTO survey_group (IsPublished,CreatorUserId,CreatedAt, Name, SurveyId ) values (?,?,?,?,?)',
      [
        newSurveyGroup.IsPublished || null,
        newSurveyGroup.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newSurveyGroup.Name,
        newSurveyGroup.SurveyId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyGroup.getSurveyGroupPaged = function (req, callback) {
  let Pagination = require('../survey_groupers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/survey_groups/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from survey_group ')
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
          'SELECT (SELECT count(*) from survey_group)  as linecount, b.*  from survey_group b LIMIT ' +
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

SurveyGroup.getSurveyGroupById = function (id, callback) {
  pool
    .query('Select x.* from survey_group x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyGroup.getAllSurveyGroup = function (callback) {
  pool
    .query('SELECT *  from survey_group ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyGroup.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE survey_group set IsDeleted = true,DeletedAt=?, DeleterUserId=?    WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyGroup.updateById = function (id, survey_group, callback) {
  survey_group.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE survey_group SET  ';

  if (survey_group.Name) {
    sql += ' Name=?,';
    params.push(survey_group.Name);
  }

  if (survey_group.SurveyId) {
    sql += ' SurveyId=?,';
    params.push(survey_group.SurveyId);
  }

  if (survey_group.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(survey_group.UpdatedAt);
  }

  if (survey_group.LastModifierUserId) {
    sql += ' LastModifierUserId=?';
    params.push(survey_group.LastModifierUserId);
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

SurveyGroup.getSurveyGroupByPollId = function (id, callback) {
  pool
    .query('Select x.* from survey_group x where PollId = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

SurveyGroup.findSurveyGroup = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from survey_group where  IsDeleted is null   ';
  let sql2 = 'SELECT  *  from survey_group where IsDeleted is null  ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and Name like ?';
    params.push(Name);

    sql2 += ' and Name like ?';
    params2.push(Name);
  }

  if (queryParams.filter.PollsId || queryParams.filter.PollsId != '') {
    sql += ' and SurveyId = ?';
    params.push(queryParams.filter.PollsId);

    sql2 += ' and SurveyId = ?';
    params2.push(queryParams.filter.PollsId);
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
      console.log('Library.findLibrary -> err', err);
      return callback(err, null);
    });
};

module.exports = SurveyGroup;
