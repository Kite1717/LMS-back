'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var MeetingUser = function (meeting_user) {
  this.Id = meeting_user.Id;
  this.IsPublished = meeting_user.IsPublished;
  this.IsDeleted = meeting_user.IsDeleted;
  this.CreatorUserId = meeting_user.CreatorUserId;
  this.CreatedAt = meeting_user.CreatedAt;
  this.LastModifierUserId = meeting_user.LastModifierUserId;
  this.UpdatedAt = meeting_user.UpdatedAt;
  this.DeleterUserId = meeting_user.DeleterUserId;
  this.DeletedAt = meeting_user.DeletedAt;
  this.MeetingId = meeting_user.MeetingId;
  this.UserId = meeting_user.UserId;
};

MeetingUser.createMeetingUser = function (newMeetingUser, callback) {
  pool
    .query(
      'INSERT INTO meeting_user (IsPublished,CreatorUserId,CreatedAt,MeetingId, UserId) values (?,?,?,?,?)',
      [
        newMeetingUser.IsPublished || null,
        newMeetingUser.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newMeetingUser.MeetingId,
        newMeetingUser.UserId || null,
      ]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

MeetingUser.getMeetingUserPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/meeting_users/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from meeting_user ')
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
          'SELECT (SELECT count(*) from meeting_user)  as linecount, b.*  from meeting_user b LIMIT ' +
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

MeetingUser.getMeetingUserById = function (id, callback) {
  pool
    .query('Select x.* from meeting_user x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

MeetingUser.getAllMeetingUser = function (callback) {
  pool
    .query('SELECT *  from meeting_user ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

MeetingUser.getMeetingUserByUserId = function (id, callback) {
  pool
    .query(
      'SELECT DISTINCT e.* from meeting_user uc INNER JOIN meeting e  ON uc.MeetingId =e.Id  where uc.UserId = ? and e.EndTime >=DATE(NOW()) order by e.StartTime ASC',
      [id,moment().format()]
    )
    .then((res) => {
      for(let i = 0 ; i <res.length ; i++)
      {
        res[i].EndTime = res[i].EndTime.toLocaleString()
        res[i].StartTime = res[i].StartTime.toLocaleString()



      }
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

MeetingUser.remove = function (id, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE IsPublished = true,DeletedAt=?, DeleterUserId=?  FROM meeting_user WHERE Id = ?',
      [deletedAt, uid, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

MeetingUser.updateById = function (id, uid, meeting_user, callback) {
  meeting_user.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  meeting_user.LastModifierUserId = uid;

  const params = [];

  let sql = 'UPDATE meeting_user SET  ';

  if (meeting_user.ToMeetingIdpicId) {
    sql += ' MeetingId=?,';
    params.push(meeting_user.MeetingId);
  }

  if (meeting_user.UserId) {
    sql += ' UserId=?,';
    params.push(meeting_user.UserId);
  }

  if (meeting_user.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(meeting_user.UpdatedAt);
  }

  if (meeting_user.LastModifierUserId) {
    sql += ' LastModifierUserId=?,';
    params.push(meeting_user.LastModifierUserId);
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

MeetingUser.updateByMeetingUserId = function (
  id,
  uid,
  begined,
  finished,
  callback
) {
  UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE meeting_user SET  ';

  if (begined) {
    sql += ' Begined=?,';
    begined = moment().format('YYYY-MM-DD HH:mm:ss');
    params.push(begined);
  }

  if (finished) {
    sql += ' Finised=?,';
    finished = moment().format('YYYY-MM-DD HH:mm:ss');
    params.push(finished);
  }

  if (UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(UpdatedAt);
  }

  if (uid) {
    sql += ' LastModifierUserId=? ';
    params.push(uid);
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


MeetingUser.getUsersByMeetingId = function (status,id,companyid, callback) {
let statusCond = ""
if(status === "joined")
{
  statusCond = "ue.Joined is not null and"
}
else if(status === "not-joined"){  // not joined
  statusCond = "ue.Joined is null and"
}
  if(companyid !== 0)
  {

    pool
    .query(
      `SELECT distinct concat(u.FirstName  , ' ' , u.LastName) AS NAME , u.Id,ue.Joined,u.TCNo,u.FirstName  , u.LastName from meeting_user ue INNER JOIN user u  ON ue.UserId  =u.Id  where ${statusCond} ue.IsDeleted is null   and ue.MeetingId= ? and u.UserStatusId = 1 and u.CompanyId = ?   order by u.FirstName asc`
      ,[id,companyid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
  }
  else{
    pool
    .query(
      `SELECT distinct concat(u.FirstName  , ' ' , u.LastName) AS NAME , u.Id,ue.Joined,u.TCNo,u.FirstName  , u.LastName from meeting_user ue INNER JOIN user u  ON ue.UserId  =u.Id  where ${statusCond} ue.IsDeleted is null and ue.MeetingId= ? and u.UserStatusId = 1 and u.CompanyId != 0  order by u.FirstName asc`
      ,[id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
  }
  
};


MeetingUser.removeByMeetingIdUserId = function (mid, uid, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE meeting_user set IsDeleted = true,DeletedAt=?    WHERE MeetingId = ? and   UserId = ?',
      [deletedAt,mid,uid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};




MeetingUser.changeUserMeetingJoinedStatus = function (mid, uid, callback) {
  
  let joined = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log(mid,uid)
  pool
    .query(
      'UPDATE meeting_user set Joined = ?    WHERE MeetingId = ? and   UserId = ? and IsDeleted is null',
      [joined,mid,uid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};


module.exports = MeetingUser;
