'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Messsage = function (message) {
  this.Id = message.Id;
  this.IsPublished = message.IsPublished;
  this.IsDeleted = message.IsDeleted;
  this.CreatorUserId = message.CreatorUserId;
  this.CreatedAt = message.CreatedAt;
  this.LastModifierUserId = message.LastModifierUserId;
  this.UpdatedAt = message.UpdatedAt;
  this.DeleterUserId = message.DeleterUserId;
  this.DeletedAt = message.DeletedAt;
  this.Text = message.Text;
  this.FromUserId = message.FromUserId;
  this.ToUserId = message.ToUserId;
  this.SendedAt = message.SendedAt;
  this.IsRead = message.IsRead;
};

Messsage.createMesssage = function (newMesssage, callback) {
  pool
    .query(
      'INSERT INTO message (IsPublished,CreatorUserId,CreatedAt,Text,FromUserId,ToUserId, SendedAt, IsRead ) values (?,?,?,?,?,?,?,?)',
      [
        newMesssage.IsPublished || null,
        newMesssage.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newMesssage.Text,
        newMesssage.CreatorUserId || null,
        newMesssage.ToUserId || null,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newMesssage.IsRead || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('asdasdsadasdasdsa');
      return callback(err, null);
    });
};

Messsage.getMesssagePaged = function (req, callback) {
  let Pagination = require('../messageers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/messages/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from message ')
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
          'SELECT (SELECT count(*) from message)  as linecount, b.*  from message b LIMIT ' +
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

Messsage.getMesssageById = function (id, callback) {
  pool
    .query('Select x.* from message x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Messsage.getAllMesssage = function (callback) {
  pool
    .query('SELECT *  from message ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Messsage.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM message WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Messsage.updateById = function (id, uid, message, callback) {
  message.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  message.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE message SET  ';

  if (message.Text) {
    sql += ' Text=?,';
    params.push(message.Text);
  }

  if (message.FromUserId) {
    sql += ' FromUserId=?,';
    params.push(message.FromUserId);
  }

  if (message.ToUserId) {
    sql += ' ToUserId=?,';
    params.push(message.ToUserId);
  }

  if (message.SendedAt) {
    sql += ' SendedAt=?,';
    params.push(message.SendedAt);
  }

  if (message.IsRead) {
    sql += ' IsRead=?,';
    params.push(message.IsRead);
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

Messsage.findMessage = function (uid, queryParams, callback) {
  let sql =
    'SELECT   COUNT(message.Id) as totalCount     from message INNER JOIN user ON user.Id = message.FromUserId or user.Id = message.ToUserId where IsDeleted is NULL ';
  let sql2 =
    'SELECT distinct  CASE    WHEN  FromUserId = ?  THEN "Siz"   ELSE "gönderen" END AS Name , message.ToUserId, message.CreatorUserId, message.Id, message.SendedAt, message.CreatedAt, message.Text,message.IsRead   from message INNER JOIN user ON user.Id = message.FromUserId or user.Id = message.ToUserId where IsDeleted is NULL ';

  console.log(uid, 'user id ');

  let sql3 =
    'SELECT  CONCAT(u.FirstName ,  " " , u.LastName) as RealName FROM message m  INNER JOIN  user  u ON u.Id = m.CreatorUserId  WHERE  u.UserStatusId = 1  AND m.ToUserId = ?';
  let params = [];
  let params2 = [];
  let params3 = [];

  params.push(uid);
  params2.push(uid);

  params3.push(uid);

  if (queryParams.filter.Text || queryParams.filter.Text != '') {
    let Text = '%' + queryParams.filter.Text + '%';
    sql += ' and Text like ? ';
    params.push(Text);

    sql2 += ' and Text like ? ';
    params2.push(Text);
  }

  if (queryParams.filter.FromUserId || queryParams.filter.FromUserId != '') {
    sql += ' and ( ToUserId= ? ';
    params.push(uid);

    sql2 += ' and ( ToUserId = ? ';
    params2.push(uid);

    sql += ' or FromUserId= ? ) ';
    params2.push(queryParams.filter.FromUserId);

    sql2 += ' or FromUserId = ? )';
    params2.push(queryParams.filter.FromUserId);
  } else {
    sql += ' and ( ToUserId= ? ';
    params.push(uid);

    sql2 += ' and ( ToUserId = ? ';
    params2.push(uid);

    sql += ' or FromUserId= ? ) ';
    params.push(uid);

    sql2 += ' or FromUserId = ? ) ';
    params2.push(uid);
  }

  console.log('Messsage.findMessage -> sql2', sql2);

  console.log('Messsage.findMessage -> sql', sql);

  sql2 += ' limit ?,?';
  sql3 += ' limit ?,?';
  let limit1 = (queryParams.pageNumber - 1) * queryParams.pageSize;
  let limit2 = queryParams.pageSize;
  params2.push(limit1);
  params2.push(limit2);

  params3.push(limit1);
  params3.push(limit2);

  pool
    .query(sql, params)
    .then((res) => {
      let totalCount = res[0].totalCount;
      pool.query(sql2, params2).then((res) => {
        pool.query(sql3, params3).then((res3) => {
          let data = {
            entities: res,
            totalCount: totalCount,
            realNames: res3,
          };

          return callback(null, data);
        });
      });
    })
    .catch((err) => {
      console.log('Messsage.findMessage -> err', err);
      return callback(err, null);
    });
};






Messsage.viewMessage = function (id, callback) {

  console.log(id,"sadfdsfds")
  pool

  .query(
    'UPDATE message SET IsRead = 1 WHERE Id = ?',
    [id]
  )
  .then((res) => {
    return callback(null, res);
  })
  .catch((err) => {
    return callback(err, null);
  });

};
module.exports = Messsage;
