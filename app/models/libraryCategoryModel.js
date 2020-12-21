'user strict';
var pool = require('./db.js').pool;
const enums = require('../helpers/enums');
var moment = require('moment');

var LibraryCategory = function (library_category) {
  this.Id = library_category.Id;
  this.IsPublished = library_category.IsPublished;
  this.IsDeleted = library_category.IsDeleted;
  this.CreatorUserId = library_category.CreatorUserId;
  this.CreatedAt = library_category.CreatedAt;
  this.LastModifierUserId = library_category.LastModifierUserId;
  this.UpdatedAt = library_category.UpdatedAt;
  this.DeleterUserId = library_category.DeleterUserId;
  this.DeletedAt = library_category.DeletedAt;
  this.Name = library_category.Name;
  this.LibraryTypeId = library_category.LibraryTypeId;
};

LibraryCategory.createLibraryCategory = function (
  newLibraryCategory,
  callback
) {
  pool
    .query(
      'INSERT INTO library_category (IsPublished,CreatorUserId,CreatedAt,Name,LibraryTypeId  ) values (?,?,?,?,?)',
      [
        newLibraryCategory.IsPublished || null,
        newLibraryCategory.CreatorUserId,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        newLibraryCategory.Name,
        newLibraryCategory.LibraryTypeId || null,
      ]
    )
    .then((res) => {
      newLibraryCategory.Id = res.insertId;
      return callback(null, newLibraryCategory);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

LibraryCategory.getLibraryCategoryPaged = function (req, callback) {
  let Pagination = require('../library_categoryers/Pagination');
  let page_id = parseInt(req.params.page);
  let currentPage = page_id > 0 ? page_id : currentPage;
  let pageUri = '/library_categorys/page/';

  pool
    .query('SELECT  COUNT(Id) as totalCount  from library_category ')
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
          'SELECT (SELECT count(*) from library_category)  as linecount, b.*  from library_category b LIMIT ' +
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

LibraryCategory.getLibraryCategoryById = function (id, callback) {
  pool
    .query('Select x.* from library_category x where Id = ? ', id)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

LibraryCategory.getAllLibraryCategory = function (callback) {
  pool
    .query('SELECT *  from library_category ')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

LibraryCategory.remove = function (id, callback) {
  deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool
    .query(
      'UPDATE library_category SET IsDeleted = 1, DeletedAt=?  WHERE Id = ?',
      [deletedAt, id]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

LibraryCategory.updateById = function (id, library_category, callback) {
  library_category.UpdatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  const params = [];

  let sql = 'UPDATE library_category SET  ';

  if (library_category.Name) {
    sql += ' Name=?,';
    params.push(library_category.Name);
  }

  if (library_category.LibraryTypeId) {
    sql += ' LibraryTypeId=?';
    params.push(library_category.LibraryTypeId);
  }

  params.push(id);

  pool
    .query(sql + '  WHERE Id = ?', params)
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      console.log('LibraryCategory.updateById -> err', err);
      return callback(err, null);
    });
};

/*************** */
LibraryCategory.findLibraryCategory = function (queryParams, callback) {
  // let sql =
  //   'SELECT count(distinct lc.Id)  as totalCount FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE  l.IsDeleted is null  ';
   let sql =
     ' SELECT  lc.Id, lc.Name, COUNT(distinct l.Id) AS FileCount, l.CourseId FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE  l.IsDeleted is null';


  let sql2 = "SELECT lc.Id, lc.Name  from library_category lc where  lc.IsDeleted is null"
  
  let params = [];

  let params2 = [];

  console.log(queryParams)

  if (queryParams.filter.Name || queryParams.filter.Name != '') {
    let Name = '%' + queryParams.filter.Name + '%';
  

    sql2 += ' and lc.Name like ? ';
    params2.push(Name);
  }

 
  if(queryParams.filter.CourseId || queryParams.filter.CourseId != '')
  {
    sql += " and l.CourseId = ?"
    params.push(queryParams.filter.CourseId)
  }
     
  
  
 
  sql += "  GROUP BY lc.Name"
 
    pool.query(sql2, params2).then((res) => {

      pool.query(sql,params).then((res2)=>{



        for(let i = 0 ; i < res.length ; i ++)
        {
          res[i].FileCount = 0;
          for(let j = 0 ; j<res2.length ; j++)
          {
           
            if(res[i].Name === res2[j].Name)
            {
              res[i].FileCount = res2[j].FileCount
              res[i].CourseId = res2[j].CourseId
              break;
            }

          }
          
        }
        let data = {
          entities: res,
          totalCount: res.length,
        };
        return callback(null, data);


      })
       
       
      }).catch((err) => {
        return callback(err, null);
      });
    
   
};

LibraryCategory.getAllLibraryCategoriesAsTag = function (callback) {
  pool
    .query('SELECT c.id , Name  AS name  from library_category c where  c.IsDeleted is null')
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

LibraryCategory.getAllLibraryByCategories = function (categoryid, callback) {
  pool
    .query(
      ' SELECT  lc.Id, lc.Name, COUNT(lc.Id) AS FileCount, l.CourseId FROM library_library_category llc INNER JOIN library l ON l.Id = llc.LibraryId INNER JOIN library_category lc ON lc.Id = llc.LibraryCategoryId WHERE l.CourseId = ? GROUP BY  l.CourseId ,lc.Id  ',
      [categoryid]
    )
    .then((res) => {
      return callback(null, res);
    })
    .catch((err) => {
      return callback(err, null);
    });
};

module.exports = LibraryCategory;
