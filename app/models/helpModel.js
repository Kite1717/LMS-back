'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Help = function (help) {
  this.Id = help.Id;
  this.IsPublished = help.IsPublished;
  this.IsDeleted = help.IsDeleted;
  this.CreatorUserId = help.CreatorUserId;
  this.CreatedAt = help.CreatedAt;
  this.LastModifierUserId = help.LastModifierUserId;
  this.UpdatedAt = help.UpdatedAt;
  this.DeleterUserId = help.DeleterUserId;
  this.DeletedAt = help.DeletedAt;
  this.Title = help.Title;
  this.Text = help.Text;
  this.HelpCategoryId = help.HelpCategoryId;
};

Help.createHelp = function (newHelp, callback) {
  pool
    .query(
      'INSERT INTO help (IsPublished,CreatorUserId,CreatedAt,Title,Text,HelpCategoryId  ) values (?,?,?,?,?,?)',
      [
        newHelp.IsPublished || null,
        newHelp.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newHelp.Title,
        newHelp.Text || null,
        newHelp.HelpCategoryId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Help.getHelpPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/helps/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from help ')
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
          'SELECT (SELECT count(*) from help)  as linecount, b.*  from help b LIMIT ' +
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

Help.getHelpById = function (id, callback) {
  pool
    .query('Select x.* from help x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Help.getAllHelp = function (callback) {
  pool
    .query('SELECT *  from help ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Help.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM help WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Help.updateById = function (id, uid, help, callback) {
  help.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  help.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE help SET  ';

  if (help.Title) {
    sql += ' Title=?,';
    params.push(help.Title);
  }

  if (help.Text) {
    sql += ' Text=?,';
    params.push(help.Text);
  }

  if (help.HelpCategoryId) {
    sql += ' HelpCategoryId=?,';
    params.push(help.HelpCategoryId);
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

Help.findHelp = function (queryParams, callback) {
  let sql = 'SELECT  COUNT(Id) as help  from help where IsDeleted is null   ';
  let sql2 = 'SELECT  Concat(u.FirstName," ", u.LastName) as FullName ,h.*  from help   h inner join user u on u.Id = h.CreatorUserId where IsDeleted is null  and u.UserStatusId = 1 ';

  let params = [];
  let params2 = [];

  if (queryParams.filter.Title || queryParams.filter.Title != '') {
    let Title = '%' + queryParams.filter.Title + '%';
    sql += ' and Title like ?,';
    params.push(Title);

    sql2 += ' and Title like ?,';
    params2.push(Title);
  }

  if (queryParams.filter.Text || queryParams.filter.Text != '') {
    let Text = '%' + queryParams.filter.Text + '%';
    sql += ' and Text like ?,';
    params.push(Text);

    sql2 += ' and Text like ?,';
    params2.push(Text);
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

module.exports = Help;
