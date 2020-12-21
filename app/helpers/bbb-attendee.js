var sha1 = require('sha1');
const axios = require('axios');

module.exports = moderator;

function moderator(fullName, meetingID, password) {
  const SECRET_KEY = 'wmsmJ3J7aNASF3Yfir70cgr3zIj6HIj29eDrSHwAho';

  const url = 'https://sanalsinif.nesslearning.com/bigbluebutton/api/join?';

  let command = 'join';

  let str =
    'fullName=' +
    fullName +
    '&meetingID=' +
    meetingID +
    '&password=' +
    password +
    '&redirect=true';

  console.log('str', str);

  let checksum = sha1(command + str + SECRET_KEY);

  return url + str + '&checksum=' + checksum;
}
