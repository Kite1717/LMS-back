'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userStatusIds = enums.UserStatusIds;

const UserRolIds = enums.UserRolIds;

var User = function (user) {
  this.Id = user.Id;
  this.Username = user.Username;
  this.Email = user.Email;
  this.EmailConfirmed = user.EmailConfirmed;
  this.Password = user.Password;
  this.PhoneNumber = user.PhoneNumber;
  this.Address = user.Address;
  this.CompanyId = user.CompanyId;
  this.UserStatusId = user.UserStatusId;
  this.IsAdmin = user.IsAdmin;
  this.FirstName = user.FirstName;
  this.LastName = user.LastName;
  this.ProfileImage = user.ProfileImage;
  this.UserCode = user.UserCode;
  this.IsResumeOk = user.IsResumeOk;
  this.IsPasswordChange = user.IsPasswordChange;
  this.CreatedUserId = user.CreatedUserId;
  this.LastUpdatedUserId = user.LastUpdatedUserId;
  this.CreatedAt = user.CreatedAt;
  this.UpdatedAt = user.UpdatedAt;
  this.DeletedAt = user.DeletedAt;
  this.Role = user.Role;
  this.TCNo = user.TCNo;
};

User.getUserPaged = function (req, callback) {
  let Pagination = require('../helpers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/users/page/';

  pool
    .query('SELECT  COUNT(*) as totalCount  from user ')
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
          'SELECT   (SELECT count(*) from user)  as linecount, *  from user LIMIT ' +
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

User.createUser = function (newUser, callback) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(newUser.Password, salt, function (err, hash) {
      newUser.Password = hash;

      console.log('User.createUser -> newUser', newUser);

      pool
        .query(
          'INSERT INTO user (Username,Email,Password,PhoneNumber,Address,CompanyId,UserStatusId,IsAdmin,FirstName,LastName,ProfileImage,UserCode, IsResumeOk,IsPasswordChange, CreatedUserId,CreatedAt, Role,TCNo ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            newUser.TCNo || null,
            newUser.Email || null,
            newUser.Password,
            newUser.PhoneNumber || null,
            newUser.Address || null,
            newUser.CompanyId || null,
            userStatusIds.ACTIVE,
            false,
            newUser.FirstName || null,
            newUser.LastName || null,
            newUser.ProfileImage || null,
            uuidv4(),
            newUser.IsResumeOk || false,
            newUser.IsPasswordChange || false,
            newUser.CreatedUserId || null,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            newUser.Role || null,
            newUser.TCNo,
          ]
        )
        .then((res) => {
          return callback(null, res);
        })
        .catch((err) => {
          return callback(err, null);
        });
    });
  });
};

User.findUser = function (role, companyid, queryParams, callback) {
  let sql =
    'SELECT  COUNT(user.Id) as totalCount  from user inner join company on user.CompanyId = company.Id inner join role on user.Role = role.Id where user.UserStatusId != ' +
    userStatusIds.DELETED;
  let sql2 =
    'SELECT  user.*, role.Title as RoleTitle, company.ShortName as CompanyTitle  from user  inner join company on user.CompanyId = company.Id inner join role on user.Role = role.Id  where  user.UserStatusId != ' +
    userStatusIds.DELETED;

  let params = [];
  let params2 = [];

  if (queryParams.filter.Username && queryParams.filter.Username != '') {
    sql += " and TCNo like CONCAT('%', ?,  '%') ";
    params.push(queryParams.filter.Username);

    sql2 += " and TCNo like  CONCAT('%', ?,  '%') ";
    params2.push(queryParams.filter.Username);
  }

  if (queryParams.filter.FirstName && queryParams.filter.FirstName != '') {
    sql += " and FirstName like CONCAT('%', ?,  '%') ";
    params.push(queryParams.filter.FirstName);

    sql2 += " and FirstName like CONCAT('%', ?,  '%')";
    params2.push(queryParams.filter.FirstName);
  }

  if (queryParams.filter.LastName && queryParams.filter.LastName != '') {
    sql += " and LastName like  CONCAT('%', ?,  '%')";
    params.push(queryParams.filter.LastName);

    sql2 += " and LastName like  CONCAT('%', ?,  '%')";
    params2.push(queryParams.filter.LastName);
  }

  if (role != 1) {
    sql += ' and CompanyId = ?';
    params.push(companyid);

    sql2 += ' and CompanyId = ?';
    params2.push(companyid);
  } else if (
    queryParams.filter.CompanyId &&
    queryParams.filter.CompanyId != '' &&
    queryParams.filter.CompanyId != 0
  ) {
    sql += ' and CompanyId =?';
    params.push(queryParams.filter.CompanyId);

    sql2 += ' and CompanyId =?';
    params2.push(queryParams.filter.CompanyId);
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
      return callback(err, null);
    });
};

User.getUserByUsernamePassword = function (req, callback) {
  pool
    .query('Select u.* from user u where u.Username = ? ', req.Username)
    .then((res) => {
      bcrypt.compare(req.Password, res[0].Password, function (err, result) {
        if (err) {
          return callback(err, null);
        }
        if (result == true) {
          return callback(null, res[0]);
        } else {
          return callback(err, null);
        }
      });
    })
    .catch((err) => {
      return callback(err, null);
    });
};

//



User.findUserByTcNo = function (tcNo, callback) {
  pool
    .query('SELECT CompanyId,Id FROM  user WHERE TcNo = ? ', tcNo)
    .then((res) => {

      return callback(null, res);

    })
    .catch((err) => {
      return callback(err, null);
    });
};

User.getUserById = function (id, callback) {
  pool
    .query('Select b.*,c.FullName as CompanyName from user b inner join company c on b.CompanyId =c.Id  where b.Id = ? ', id)
    .then((res) => {

      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

User.getAllUser = function (callback) {
  pool
    .query('SELECT *  from user ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

User.updateById = function (id, user, callback) {
  user.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE user SET  ';

  if (user.PhoneNumber) {
    sql += ' PhoneNumber=?,';
    params.push(user.PhoneNumber);
  }

  if (user.Address) {
    sql += ' Address=?,';
    params.push(user.Address);
  }

  if (user.CompanyId) {
    sql += ' CompanyId=?,';
    params.push(user.CompanyId);
  }

  if (user.UserStatusId) {
    sql += ' UserStatusId=?,';
    params.push(user.UserStatusId);
  }

  if (user.FirstName) {
    sql += ' FirstName=?,';
    params.push(user.FirstName);
  }

  if (user.LastName) {
    sql += ' LastName=?,';
    params.push(user.LastName);
  }

  if (user.ProfileImage) {
    sql += ' ProfileImage=?';
    params.push(user.ProfileImage);
  }

  if (user.IsResumeOk) {
    sql += ' IsResumeOk=?';
    params.push(user.IsResumeOk);
  }

  if (user.Role) {
    sql += ' Role=?,';
    params.push(user.Role);
  }

  if (user.UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(user.UpdatedAt);
  }

  if (user.LastUpdatedUserId) {
    sql += ' LastUpdatedUserId=?';
    params.push(user.LastUpdatedUserId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('User.updateById -> err', err);

      return callback(err, null);
    });
};

User.updateKvkkPhoneById = function (id, kvkk, phone, callback) {
  let UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE user SET  ';

  if (phone) {
    sql += ' PhoneNumber=?,';
    params.push(phone);
  }

  if (kvkk) {
    sql += ' KVKK=?,';
    params.push(kvkk);
  }

  if (UpdatedAt) {
    sql += ' UpdatedAt=?,';
    params.push(UpdatedAt);
  }

  if (id) {
    sql += ' LastUpdatedUserId=?';
    params.push(id);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('User.updateById -> err', err);

      return callback(err, null);
    });
};

User.remove = function (id, callback) {
  pool
    .query('UPDATE user SET UserStatusId = ? WHERE Id = ?', [
      userStatusIds.DELETED,
      id,
    ])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

User.getAllUserAsTag = function (companyid, callback) {

  let sql;
  let params = []

  if (companyid !== 0) {
    sql =
      "SELECT c.id , CONCAT(c.FirstName, ' ',c.LastName)  AS name  from user c  where  c.CompanyId = ? and c.Role = 4    and c.UserStatusId != " +
      userStatusIds.DELETED +
      ' order by c.Firstname asc';
    params.push(companyid)
  }
  else {
    sql =
      "SELECT c.id , CONCAT(c.FirstName, ' ',c.LastName)  AS name  from user c  where  c.CompanyId != 0 and c.Role = 4  and c.UserStatusId != " +
      userStatusIds.DELETED +
      ' order by c.Firstname asc';

  }


  pool
    .query(sql, params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

User.findMessageUser = function (role, companyid, uid, callback) {
  let sql = '';

  if (role == UserRolIds.CompanyAdmin) {
    sql =
      'SELECT DISTINCT * FROM user WHERE  UserStatusId =1 and Id != ?  and  ( (Role = 1 ) OR (Role = 2 and CompanyId = ?) OR (Role = 3 and CompanyId = ?) OR (Role = 4 and CompanyId = ?))';
  } else if (role == UserRolIds.Trainer) {
    sql =
      'SELECT DISTINCT * FROM user WHERE  UserStatusId =1 and   Id != ?  and   ( (Role = 1 ) OR (Role = 2 and CompanyId = ?) OR (Role = 3 and CompanyId = ?) OR (Role = 4 and CompanyId = ?))';
  } else if (role == UserRolIds.Employee) {
    sql =
      'SELECT  DISTINCT * FROM user WHERE  UserStatusId = 1  and  Id != ?  and   ((Role = 3 and CompanyId = ?) OR (Role = 2 and CompanyId = ?))';
  } else if (role == UserRolIds.Admin) {
    sql = 'SELECT DISTINCT * FROM user WHERE  UserStatusId = 1  and Id != ? and  (Role = 3 OR Role = 2) and CompanyId != 0';
  }

  pool
    .query(sql, [uid, companyid, companyid, companyid])
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = User;
