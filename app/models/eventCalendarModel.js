'user strict';
const mariadb = require('mariadb');
const enums = require('../helpers/enums');
var moment = require('moment');




//server

const epool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'eventusr',
  password: 'Ybft19!2',
  database: 'ness_event',
  port: '3306',
  queueLimit: 5,
  connectionLimit: 1,
});





// //local
//  const epool = mariadb.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '1234',
//   database: 'event_calendar',
//   port: '3306',
//   queueLimit: 5,
//   connectionLimit: 1,
// }); 



module.exports = { CreateEvent, GetExamByDate, GetAllEvents, UpdateEvent, DeleteEvent };

function CreateEvent(newMeeting, start, end, callback) {

  epool
    .query(
      'INSERT INTO event (IsPublished,CreatorUserId,CreatedAt,CompanyId, MeetingID,AttendeePW ,MeetingName,ModeratorPW,Logo,BannerText,BannerColor,Copyright,StartDate,EndDate ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
      //Id = res.insertId;
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
}



function UpdateEvent(meeting, currenInfo, callback) {

  const params = [];

  let sql = 'UPDATE event SET  ';

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
    sql += ' StartDate=?,';
    params.push(meeting.StartTime);
  }

  if (meeting.EndTime) {
    sql += ' EndDate=?,';
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






  sql += " WHERE "

  if (currenInfo.MeetingID) {
    sql += ' MeetingId=?';
    params.push(currenInfo.MeetingID);
  }




  epool
    .query(sql, params)
    .then((res) => {
      console.log(res, "calıstımmm")
      return callback(null, res);
    })
    .catch((err) => {
      console.log('Musta fırat yılmaz -> err', err);
      return callback(err, null);
    });

}


function DeleteEvent(deletedAt, MeetingId, callback) {
  epool
    .query('UPDATE event SET IsDeleted = 1, DeletedAt=?  WHERE MeetingId = ?', [
      deletedAt,
      MeetingId,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
}



function GetExamByDate(startdate, enddate, MeetingId, callback) {

  console.log(MeetingId, "sdfsdfdsfdsfdsfdsfdsfsdfdsfds")
  if (MeetingId == null) {

    epool
      .query(
        'Select count(*) as checkcount from event where   ((StartDate <= ? and EndDate >=?) or (StartDate <= ? and EndDate >= ? )  or (StartDate >= ? and EndDate <= ? ))   and IsDeleted is null  ',
        [startdate, startdate, enddate, enddate, startdate, enddate]
      )
      .then((res) => {
        console.log(res[0], "asdasdsad")
        return callback(null, res);
      })
      .catch((err) => {
        return callback(err, null);
      });
  }
  else {

    epool
      .query(
        'Select count(*) as checkcount,event.* from event where   ((StartDate <= ? and EndDate >=?) or (StartDate <= ? and EndDate >= ? )  or (StartDate >= ? and EndDate <= ? )) and  event.MeetingID != ? and event.IsDeleted is null   ',
        [startdate, startdate, enddate, enddate, startdate, enddate, MeetingId]
      )
      .then((res) => {

        console.log(res[0], "bu bir sonuçççç")
        return callback(null, res);
      })
      .catch((err) => {
        console.log(err, "bu bir hatadır")
        return callback(err, null);
      });
  }

}

function GetAllEvents(callback) {
  epool
    .query('Select * from event  where  StartDate >= NOW() and IsDeleted is null')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
}
