'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var Announcement = function (announcement) {
  this.Id = announcement.Id;
  this.IsPublished = announcement.IsPublished;
  this.IsDeleted = announcement.IsDeleted;
  this.CreatorannouncementId = announcement.CreatorannouncementId;
  this.CreatedAt = announcement.CreatedAt;
  this.LastModifierUserId = announcement.LastModifierUserId;
  this.UpdatedAt = announcement.UpdatedAt;
  this.DeleterannouncementId = announcement.DeleterannouncementId;
  this.DeletedAt = announcement.DeletedAt;
  this.Title = announcement.Title;
  this.Text = announcement.Text;
};

Announcement.createAnnouncement = function (newAnnouncement, uid, callback) {
  pool
    .query(
      'INSERT INTO announcement (IsPublished,CreatorallowedIpId,CreatedAt, Title,Text ) values (?,?,?,?,?)',
      [
        newAllowedIp.IsPublished || null,
        uid,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newAllowedIp.Title,
        newAllowedIp.Text || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Announcement.getAnnouncementPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/announcements/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from announcement ')
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
          'SELECT (SELECT count(*) from announcement)  as linecount, b.*  from announcement b LIMIT ' +
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

Announcement.getAnnouncementById = function (id, callback) {
  pool
    .query('Select x.* from announcement x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Announcement.getAllAnnouncement = function (callback) {
  pool
    .query('SELECT *  from announcement ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Announcement.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM announcement WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Announcement.updateById = function (id, uid, announcement, callback) {
  announcement.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  announcement.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE announcement SET  ';

  if (announcement.Title) {
    sql += ' Title=?,';
    params.push(announcement.Title);
  }

  if (announcement.Text) {
    sql += ' Text=?,';
    params.push(announcement.Text);
  }

  if (announcement.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(announcement.UpdatedAt);
  }

  if (announcement.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(announcement.LastModifierUserId);
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

module.exports = Announcement;
