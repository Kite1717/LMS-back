'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var { CreateEvent, GetExamByDate ,UpdateEvent,DeleteEvent} = require('./eventCalendarModel');

var Meeting = function (meeting) {
  this.Id = meeting.Id;
  this.IsPublished = meeting.IsPublished;
  this.IsDeleted = meeting.IsDeleted;
  this.CreatorUserId = meeting.CreatorUserId;
  this.CreatedAt = meeting.CreatedAt;
  this.LastModifierUserId = meeting.LastModifierUserId;
  this.UpdatedAt = meeting.UpdatedAt;
  this.DeleterUserId = meeting.DeleterUserId;
  this.DeletedAt = meeting.DeletedAt;

  this.CompanyId = meeting.CompanyId;
  this.MeetingID = meeting.MeetingID;
  this.AttendeePW = meeting.AttendeePW;
  this.MeetingName = meeting.MeetingName;
  this.ModeratorPW = meeting.ModeratorPW;
  this.Logo = meeting.Logo;
  this.BannerText = meeting.BannerText;
  this.BannerColor = meeting.BannerColor;
  this.Copyright = meeting.Copyright;
  this.StartDate = meeting.StartDate;
  this.EndDate = meeting.EndDate;
  this.StartTime = meeting.StartTime;
  this.EndTime = meeting.EndTime;
};

Meeting.createMeeting = function (newMeeting, callback) {
  let start = moment(newMeeting.StartTime)
 // .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');
  let end = moment(newMeeting.EndTime)
  //.add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');


    /* local
     let start = moment(newMeeting.StartTime)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');
  let end = moment(newMeeting.EndTime)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');
    */

  GetExamByDate(start, end,null, function (err, eresult) {

   
    if (err) return callback(err, null);
    // if (eresult[0].checkcount > 0)
    //   return callback('Bu tarihte event var! Başka bir tarih seçin.', null);

    
    CreateEvent(
      newMeeting,
      start || null,
      end || null,
      function (err, eventResult) {}
    );

    

    pool
      .query(
        'INSERT INTO meeting (IsPublished,CreatorUserId,CreatedAt,CompanyId, MeetingID,AttendeePW ,MeetingName,ModeratorPW,Logo,BannerText,BannerColor,Copyright,StartTime,EndTime ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          newMeeting.IsPublished || null,
          newMeeting.CreatorUserId,
          moment().format('YYYY-MM-DD HH:mm:ss'),
          newMeeting.CompanyId,
          newMeeting.MeetingID || null,
          newMeeting.AttendeePW || null,
          newMeeting.MeetingName || null,
          newMeeting.ModeratorPW || null,
          newMeeting.Logo || null,
          newMeeting.BannerText || null,
          newMeeting.BannerColor || null,
          newMeeting.Copyright || null,
          start || null,
          end || null,
        ]
      )
      .then((res) => {
        // newMeeting.StartTime = start;
        // newMeeting.EndTime = end;
        newMeeting.Id = res.insertId;
        return callback(null, newMeeting);
      })
      .catch((err) => {
        return callback(err, null);
      });
  });
};

Meeting.findMeeting = function (queryParams, callback) {
  let sql =
    'SELECT  COUNT(Id) as totalCount  from meeting where IsDeleted is null ';
  let sql2 = 'SELECT  *  from meeting where IsDeleted is null ';

  let params = [];
  let params2 = [];

 
  if (queryParams.filter.Name || queryParams.filter.Name != '') {


    let Name = '%' + queryParams.filter.Name + '%';
    sql += ' and MeetingName like ?';
    params.push(Name);

    sql2 += ' and MeetingName like ?';
    params2.push(Name);


   /* sql += " and MeetingName like '%?%'";
    params.push(queryParams.filter.Name);

    sql2 += " and MeetingName like '%?%'";
    params2.push(queryParams.filter.Name); */
  }


  /*
  if (queryParams.filter.Description || queryParams.filter.Description != '') {
    sql += " and Description like CONCAT('%', ?,  '%') ";
    params.push(queryParams.filter.Description);

    sql2 += " and Description like CONCAT('%', ?,  '%')";
    params2.push(queryParams.filter.Description);
  } */

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

Meeting.getMeetingPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/meetings/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from meeting ')
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
          'SELECT (SELECT count(*) from meeting)  as linecount, b.*  from meeting b LIMIT ' +
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

Meeting.getMeetingById = function (id, callback) {
  pool
    .query(
      "SELECT Id,IsPublished,IsDeleted,CreatorUserId,CreatedAt,LastModifierUserId,UpdatedAt,DeleterUserId,DeletedAt,CompanyId,MeetingID,AttendeePW,MeetingName,ModeratorPW,Logo,BannerText,BannerColor,Copyright, DATE_FORMAT(starttime, '%X-%c-%d') AS StartDate, DATE_FORMAT(starttime, '%H:%i') AS StartTime,   DATE_FORMAT(endtime, '%X-%c-%d') AS EndDate, DATE_FORMAT(endtime, '%H:%i') AS EndTime   FROM meeting    where Id = ? ",
      id
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Meeting.getAllMeeting = function (callback) {
  pool
    .query('SELECT *  from meeting  where IsDeleted is null ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

Meeting.remove = function (id, callback) {
  let deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  

  
  pool
    .query('Select MeetingId from  meeting  WHERE Id = ?', [
      id,
    ])
    .then((res) => {
      console.log(res[0])
      DeleteEvent(
        deletedAt,
        res[0].MeetingId,
        function (err, eventResult) {}
      ); 

      pool
    .query('UPDATE meeting SET IsDeleted = 1, DeletedAt=?  WHERE Id = ?', [
      deletedAt,
      id,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    }); 
    

    })
    .catch((err) => {
      return callback(err, null);
    });




};

Meeting.updateById = function (id, meeting, callback) {
  meeting.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');



  const params3 = [];
  
  let sql3 = "Select MeetingId  from meeting"
  params3.push(id)

  pool
    .query(sql3 + '  WHERE Id = ?', params3)
    .then((res2) => {
     
     

//*********************************** */



GetExamByDate(meeting.StartTime, meeting.EndTime,  res2[0].MeetingId, function (err, eresult) {

  if (err) return callback(err, null);
  // if (eresult[0].checkcount > 0)
  //   return callback('Bu tarihte event var! Başka bir tarih seçin.', null);


const params = [];

let sql = 'UPDATE meeting SET  ';

if (meeting.CompanyId) {
  sql += ' CompanyId=?,';
  params.push(meeting.CompanyId);
}

if (meeting.AttendeePW) {
  sql += ' AttendeePW=?,';
  params.push(meeting.AttendeePW);
}

if (meeting.MeetingName) {
  sql += ' MeetingName=?,';
  params.push(meeting.MeetingName);
}

if (meeting.ModeratorPW) {
  sql += ' ModeratorPW=?,';
  params.push(meeting.ModeratorPW);
}

if (meeting.Logo) {
  sql += ' Logo=?,';
  params.push(meeting.Logo);
}

if (meeting.BannerText) {
  sql += ' BannerText=?,';
  params.push(meeting.BannerText);
}

if (meeting.BannerColor) {
  sql += ' BannerColor=?,';
  params.push(meeting.BannerColor);
}

if (meeting.Copyright) {
  sql += ' Copyright=?,';
  params.push(meeting.Copyright);
}

if (meeting.StartTime) {
  sql += ' StartTime=?,';
  params.push(meeting.StartTime);
}

if (meeting.EndTime) {
  sql += ' EndTime=?,';
  params.push(meeting.EndTime);
}

if (meeting.UpdatedAt) {
  sql += ' UpdatedAt=?,';
  params.push(meeting.UpdatedAt);
}

if (meeting.LastModifierUserId) {
  sql += ' LastModifierUserId=?';
  params.push(meeting.LastModifierUserId);
}

params.push(id);


//************* */
const params2 = []
let sql2 = "Select *  from meeting"
params2.push(id)

pool
  .query(sql2 + '  WHERE Id = ?', params2)
  .then((res) => {
  

    UpdateEvent(
      meeting,
      res[0],
      function (err, eventResult) {}
    );
  
    pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Meeting.updateById -> err', err);
      return callback(err, null);
    });


  })
  .catch((err) => {
    console.log('Meeting.updateById -> err', err);
    return callback(err, null);
  });
//*************** */
});

















//*********************************************** */

    })
    .catch((err) => {
      console.log('Meeting.updateById -> err', err);
      return callback(err, null);
    });




 
  
};

Meeting.getMeetingByMeetingId = function (id, callback) {
  pool
    .query(
      "SELECT Id,IsPublished,IsDeleted,CreatorUserId,CreatedAt,LastModifierUserId,UpdatedAt,DeleterUserId,DeletedAt,CompanyId,MeetingID,AttendeePW,MeetingName,ModeratorPW,Logo,BannerText,BannerColor,Copyright, DATE_FORMAT(starttime, '%X-%c-%d') AS StartDate, DATE_FORMAT(starttime, '%H:%i') AS StartTime,   DATE_FORMAT(endtime, '%X-%c-%d') AS EndDate, DATE_FORMAT(endtime, '%H:%i') AS EndTime   FROM meeting    where MeetingID = ? ",
      id
    )
    .then((res) => {
      return callback(null, res[0]);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = Meeting;
