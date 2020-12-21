var myenv = process.env.NODE_ENV || 'Production';

var CronJob = require('cron').CronJob;
var Question = require('./app/models/questionModel');
var User = require('./app/models/userModel');

var BulkFile = require('./app/models/bulkFileModel');

const job = new CronJob('0 */1 * * * *', function () {
  console.log('Cron Started ');
  BulkFile.getAllBulkFileByStatus(function (err, result) {
  
    if (!err) {
      for (let bf of result) {
        if (bf.FileTypeId === 1) {
          if (typeof require !== 'undefined') XLSX = require('xlsx');
          var workbook = XLSX.readFile('./uploads/' + bf.File);
          var sheet_name_list = workbook.SheetNames;
          sheet_name_list.forEach(function (y) {
            var worksheet = workbook.Sheets[y];
            var headers = {};
            var data = [];
            for (z in worksheet) {
              if (z[0] === '!') continue;
              //parse out the column, row, and value
              var tt = 0;
              for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                  tt = i;
                  break;
                }
              }
              var col = z.substring(0, tt);
              var row = parseInt(z.substring(tt));
              var value = worksheet[z].v;

              //store header names
              if (row == 1 && value) {
                headers[col] = value;
                continue;
              }

              if (!data[row]) data[row] = {};
              data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();

            let topicId = bf.TopicId;
            let userId = bf.CreatorUserId;

            for (item of data) {
              var new_question = new Question({
                Text: item.Text,
                TopicId: topicId,
                CreatorUserId: userId,
                IsSectionEndQuestion: item.IsSectionEndQuestion,
              });

              var newQuestionBody = {
                question: {
                  AText: item.Opt1,
                  A: item.TrueOption == 1 ? 1 : 2,
                  BText: item.Opt2,
                  B: item.TrueOption == 2 ? 1 : 2,
                  CText: item.Opt3,
                  C: item.TrueOption == 3 ? 1 : 2,
                  DText: item.Opt4,
                  D: item.TrueOption == 4 ? 1 : 2,
                },
              };

              Question.createQuestion(new_question, newQuestionBody, function (
                err,
                result
              ) {
                if (err) {
                } else {
                }
              });

              BulkFile.updateBulkFileStatus(bf.Id);
            }
          });
        } else if (bf.FileTypeId === 2) {

          console.log('Bulk User Insert');
          if (typeof require !== 'undefined') XLSX = require('xlsx');
          var workbook = XLSX.readFile('./uploads/' + bf.File);
          var sheet_name_list = workbook.SheetNames;

          sheet_name_list.forEach(function (y) {
            var worksheet = workbook.Sheets[y];
            var headers = {};
            var data = [];
            for (z in worksheet) {
              if (z[0] === '!') continue;
              //parse out the column, row, and value
              var tt = 0;
              for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                  tt = i;
                  break;
                }
              }
              var col = z.substring(0, tt);
              var row = parseInt(z.substring(tt));
              var value = worksheet[z].v;

              //store header names
              if (row == 1 && value) {
                headers[col] = value;
                continue;
              }

              if (!data[row]) data[row] = {};
              data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();

            let companyId = bf.CompanyId;
            let userId = bf.CreatorUserId;

            for (item of data) {
              var new_user = new User({
                TCNo: item.TCNo.toString(),
                CompanyId: companyId,
                CreatorUserId: userId,
                FirstName: item.FirstName,
                LastName: item.LastName,
                PhoneNumber: item.PhoneNumber.toString(),
                Username: item.TCNo.toString(),
                Role: 4,
              });

              new_user.Password = new_user.TCNo.substring(5);

              User.createUser(new_user, function (err, result) {
                if (err) {
                }
              });

              BulkFile.updateBulkFileStatus(bf.Id);
            }
          });
        }

        //--------------
      }
    }
  });
});

job.start();

var bodyParser = require('body-parser');

const errorHandler = require('./app/helpers/error-handler');

var cors = require('cors');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', function () {
  console.log('Listening to port:  ' + 4000);
});

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/files', express.static('uploads'));

var userRoute = require('./app/routes/userRoute');
var companyRoute = require('./app/routes/companyRoute');
var coursePackageRoute = require('./app/routes/coursePackageRoute');
var courseRoute = require('./app/routes/courseRoute');
var topicRoute = require('./app/routes/topicRoute');
var courseSectionRoute = require('./app/routes/courseSectionRoute');
var questionsRoute = require('./app/routes/questionsRoute');
var coursePackageCompanyRoute = require('./app/routes/coursePackageCompanyRoute');
var examRoute = require('./app/routes/examRoute');
var userExamRoute = require('./app/routes/userExamRoute');
var examQuestionRoute = require('./app/routes/examQuestionRoute');
var userExamAnswerRoute = require('./app/routes/userExamAnswerRoute');
var courseUserRoute = require('./app/routes/courseUserRoute');
var documentCategoryRoute = require('./app/routes/documentCategoryRoute');
var meetingRoute = require('./app/routes/meetingRoute');
var meetingUserRoute = require('./app/routes/meetingUserRoute');
var documentSubCategoryRoute = require('./app/routes/documentSubCategoryRoute');
var documentRoute = require('./app/routes/documentRoute');
var libraryCategoryRoute = require('./app/routes/libraryCategoryRoute');
var libraryRoute = require('./app/routes/libraryRoute');
var messageRoute = require('./app/routes/messageRoute');
var bulkFileRoute = require('./app/routes/bulkFileRoute');
var visualQuestionsRoute = require('./app/routes/visualQuestionsRoute');
var resumesRoute = require('./app/routes/resulmeRoute');
//var helpCategoryRoute = require('./app/routes/helpCategoryRoute');
var helpRoute = require('./app/routes/helpRoute');
var allowedIpRoute = require('./app/routes/allowedIpRoute');
var activityLogRoute = require('./app/routes/activityLogRoute');
var surveyRoute = require('./app/routes/surveyRoute');
var surveyGroupRoute = require('./app/routes/surveyGroupRoute');
var surveyQuestionRoute = require('./app/routes/surveyQuestionRoute');
var surveyAnswerRoute = require('./app/routes/surveyAnswerRoute');
var visualExamRoute = require('./app/routes/visualExamRoute');
var settingRoute = require('./app/routes/settingRoute');
var reportRoute = require('./app/routes/reportRoute');
var certificateRoute = require('./app/routes/certificateRoute');

userRoute(app);
companyRoute(app);
coursePackageRoute(app);
courseRoute(app);
topicRoute(app);
courseSectionRoute(app);
questionsRoute(app);
coursePackageCompanyRoute(app);
examRoute(app);
userExamRoute(app);
examQuestionRoute(app);
userExamAnswerRoute(app);
courseUserRoute(app);
documentCategoryRoute(app);
meetingRoute(app);
meetingUserRoute(app);
documentSubCategoryRoute(app);
documentRoute(app);
libraryCategoryRoute(app);
libraryRoute(app);
messageRoute(app);
bulkFileRoute(app);
visualQuestionsRoute(app);
resumesRoute(app);
helpRoute(app);
allowedIpRoute(app);
activityLogRoute(app);
surveyRoute(app);
surveyGroupRoute(app);
surveyQuestionRoute(app);
surveyAnswerRoute(app);
visualExamRoute(app);
settingRoute(app);
reportRoute(app);
certificateRoute(app);

app.use(errorHandler);
