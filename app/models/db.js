'user strict';

var myenv = process.env.NODE_ENV || 'Production';

console.log('process.env.NODE_ENV -', process.env.NODE_ENV);

const mariadb = require('mariadb');

var pool = {};

/* Ness
if (myenv == 'Production') {
  pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'lmsness',
    password: '1H#fq6v3',
    database: 'ness_lms',
    port: '3306',
    queueLimit: 0, // unlimited queueing
    connectionLimit: 100, // unlimited connections
  });*/
/* HKU *
if (myenv == 'Production') {
  pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'kalyoncu',
    password: 'Xu$7p4b6',
    database: 'ness_hku',
    port: '3306',
    queueLimit: 0, // unlimited queueing
    connectionLimit: 100, // unlimited connections
  });
   
  pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'yesese',
    password: '8h#j9aV9',
    database: 'ness_yss',
    port: '3306',
    queueLimit: 0, // unlimited queueing
    connectionLimit: 100, // unlimited connections
  });
/*yda */
if (myenv == 'Production') {
  pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'sistemg',
    password: 'Ugf#a697',
    database: 'ness_sistem',
    port: '3306',
    queueLimit: 0, // unlimited queueing
    connectionLimit: 100, // unlimited connections
  });
} else {
  pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'egitim',
    port: '3306',
    queueLimit: 0, 
    connectionLimit: 100,  

    // host: '161.97.84.69',
    // user: 'lmscode',
    // password: '8Ave_a99',
    // database: 'code35_lms',
    // port: '3306',
    // queueLimit: 0, // unlimited queueing
    // connectionLimit: 100, // unlimited connections

  });
}
module.exports = { pool };
