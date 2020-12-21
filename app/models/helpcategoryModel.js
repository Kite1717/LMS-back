'user strict';
var pool = require('./db.js').pool;
const enums = require('../help_categoryers/enums');
var moment = require('moment');

var HelpCategory = function (help_category) {
  this.Id = help_category.Id;
  this.IsPublished = help_category.IsPublished;
  this.IsDeleted = help_category.IsDeleted;
  this.CreatorUserId = help_category.CreatorUserId;
  this.CreatedAt = help_category.CreatedAt;
  this.LastModifierUserId = help_category.LastModifierUserId;
  this.UpdatedAt = help_category.UpdatedAt;
  this.DeleterUserId = help_category.DeleterUserId;
  this.DeletedAt = help_category.DeletedAt;
  this.Name = help_category.Name;
};

HelpCategory.createHelpCategory = function (newHelpCategory, uid, callback) {
  pool
    .query(
      'INSERT INTO help_category (IsPublished,CreatorUserId,CreatedAt,Name ) values (?,?,?,?)',
      [
        newHelpCategory.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newHelpCategory.Name,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

HelpCategory.getHelpCategoryPaged = function (req, callback) {
  let Pagination = require('../help_categoryers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/help_categorys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from help_category ')
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
          'SELECT (SELECT count(*) from help_category)  as linecount, b.*  from help_category b LIMIT ' +
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

HelpCategory.getHelpCategoryById = function (id, callback) {
  pool
    .query('Select x.* from help_category x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

HelpCategory.getAllHelpCategory = function (callback) {
  pool
    .query('SELECT Id,Name  FROM  help_category ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

HelpCategory.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM help_category WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

HelpCategory.updateById = function (id, uid, help_category, callback) {
  help_category.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  help_category.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE help_category SET  ';

  if (help_category.Name) {
    sql += ' Name=?,';
    params.push(help_category.Name);
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

module.exports = HelpCategory;
