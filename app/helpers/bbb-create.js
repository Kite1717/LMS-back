var sha1 = require('sha1');
const axios = require('axios');

module.exports = create;

function create(attendeePW, meetingID, moderatorPW, name, callback) {
  const SECRET_KEY = 'wmsmJ3J7aNASF3Yfir70cgr3zIj6HIj29eDrSHwAho';

  const url = 'https://sanalsinif.nesslearning.com/bigbluebutton/api/create?';
  console.log('url', url);

  let command = 'create';

  attendeePW = encodeURIComponent(attendeePW);
  name = encodeURIComponent(name);

  let str =
    'attendeePW=' +
    attendeePW +
    '&meetingID=' +
    meetingID +
    '&moderatorPW=' +
    moderatorPW +
    '&name=' +
    name +
    '&record=true&autoStartRecording=true&disableRecordingDefault=true';
  console.log('str', str);

  let checksum = sha1(command + str + SECRET_KEY);

  axios
    .get(url + str + '&checksum=' + checksum)
    .then(function (response) {
      callback(null, response);
    })
    .catch(function (error) {
      callback(error, null);
    });
}
