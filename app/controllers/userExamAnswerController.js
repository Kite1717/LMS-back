'use strict';

const jwt = require('jsonwebtoken');
var UserExamAnswer = require('../models/userExamAnswerModel.js');
const { secret } = require('../../config.json');

var Exam = require('../models/examModel');
var UserExam = require('../models/userExamModel.js');
var Certificate = require('../models/certificateModel.js');
var QuestionAnswer = require('../models/questionAnswerModel.js');
var VisualQuestion = require('../models/visualQuestionModel');

exports.list_userExamAnswers_paged = function (req, res) {
  UserExamAnswer.getUserExamAnswerPaged(req, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_userExamAnswers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExamAnswer.getAllUserExamAnswer(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.list_all_userExamAnswers_as_tag = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExamAnswer.getAllUserExamAnswerAsTag(function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.find_userExamAnswers = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let queryParams = req.body.queryParams;
  console.log('exports.find_userExamAnswers -> queryParams', queryParams);

  UserExamAnswer.findUserExamAnswer(queryParams, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};

exports.create_a_userExamAnswer = function (req, res) {
  //req.user.uid;
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  var userExamAnswerList = req.body.answerList;
  var examCode;

  if (req.body.examCode) examCode = req.body.examCode;
  else if (req.body.visualExamCode) examCode = req.body.visualExamCode;

  if (!examCode) {
    res.status(400).send({
      error: true,
      message: 'Please provide fields',
    });
  } else {
    UserExam.getUserExamByExamCode(examCode, function (err, resUserExam) {
      console.log(
        'exports.create_a_userExamAnswer -> resUserExam',
        resUserExam
      );
      if (err) res.status(400).send(err);
      else {
        if (resUserExam[0].ExamTypeId == 1) {
          // Theoric Question
          QuestionAnswer.getAllQuestionAnswerByExamId(
            resUserExam[0].ExamId,
            function (err, resQuestionAnswer) {
              let CorrectCount = 0;
              let WrongCount = 0;
              let UserSuccessRate = 0;
              //let MinSuccessRate = 0; // bunu kayıtta ekleyelim

              for (let userExamAnswer of userExamAnswerList) {
                let new_userExamAnswer = {
                  UserExamId: resUserExam[0].ExamId,
                  QuestionId: userExamAnswer.QuestionId,
                  QuestionAnswersId: userExamAnswer.AnswerId,
                  CreatorUserId: req.user.uid,
                };

                for (let qa of resQuestionAnswer) {
                  if (qa.QuestionId == userExamAnswer.QuestionId) {
                    if (qa.Id == userExamAnswer.AnswerId) CorrectCount++;
                    else WrongCount++;
                  }
                }

                UserExamAnswer.createUserExamAnswer(
                  new_userExamAnswer,
                  function (err, result) {
                    if (err) {
                      res.status(400).send(err);
                    }
                  }
                );
              }

              UserSuccessRate = (100 / resQuestionAnswer.length) * CorrectCount;

              let cert = new Certificate({
                CreatorUserId: req.user.uid,
                UserId: req.user.uid,
                CCode: resUserExam[0].ExamCode,
                ExamId: resUserExam[0].ExamId,
              });

              Certificate.createCertificate(cert, function (err, cResult) {
                if (err) res.status(400).send(err);
                else {
                  UserExam.updateCountsandRatesByExamCode(
                    examCode,
                    CorrectCount,
                    WrongCount,
                    UserSuccessRate,
                    req.user.uid,
                    function (err, result) {
                      if (err) {
                        res.status(400).send(err);
                      }
                      res.json(result);
                    }
                  );
                }
              });
            }
          );

          // Theoric Question End
        } else {
          // Graphical Question

          VisualQuestion.getAllQuestionAnswerByExamId(
            resUserExam[0].ExamId,
            function (err, resQuestionAnswer) {
              let CorrectCount = 0;
              let WrongCount = 0;
              let UserSuccessRate = 0;
              //let MinSuccessRate = 0; // bunu kayıtta ekleyelim

              let counter = 0;
              for (let userExamAnswer of userExamAnswerList) {
                let new_userExamAnswer = {
                  UserExamId: resUserExam[0].ExamId || null,
                  QuestionId: userExamAnswer.QuestionId || null,
                  AnswersId: userExamAnswer.AnswerId || null ,
                //  TruePlaceToClick: userExamAnswer.TruePlaceClick || null,
                  CreatorUserId: req.user.uid || null,
                };

                  
             
                
                
                  let ans = '';
                  if (resQuestionAnswer[counter].A !== undefined && resQuestionAnswer[counter].A === 1) ans = 'A';
                  else if (resQuestionAnswer[counter].B !== undefined && resQuestionAnswer[counter].B === 1) ans = 'B';
                  else if (resQuestionAnswer[counter].C !== undefined && resQuestionAnswer[counter].C === 1) ans = 'C';
                  else if (resQuestionAnswer[counter].D !== undefined && resQuestionAnswer[counter].D === 1) ans = 'D';




                  if(resQuestionAnswer[counter].QuestionType === 1) 
                  { 


                    if((resQuestionAnswer[counter].IsThreatExists === 1 && userExamAnswer.AnswerId === "V")
                     || (resQuestionAnswer[counter].IsThreatExists === 0 && userExamAnswer.AnswerId === "Y") ) 
                    {
                      new_userExamAnswer.TruePlaceToClick = 1;
                      CorrectCount++;
                    }
                    else{
                      WrongCount++;
                    }

                  }
                  else if(resQuestionAnswer[counter].QuestionType === 2)
                  {
                    if(ans === userExamAnswer.AnswerId)
                    {
                      new_userExamAnswer.TruePlaceToClick = 1;
                      CorrectCount++; 
                    }
                    else
                    {
                      WrongCount++; 
                    }
                  }
                  else if(resQuestionAnswer[counter].QuestionType === 3)
                  {

                    if((resQuestionAnswer[counter].IsThreatExists === 1 && userExamAnswer.AnswerId === "V")
                    || (resQuestionAnswer[counter].IsThreatExists === 0 && userExamAnswer.AnswerId === "Y") ) 
                   {
                     if( userExamAnswer.TruePlaceClick)
                     {
                      new_userExamAnswer.TruePlaceToClick = 1;
                      CorrectCount++;
                     }
                  
                   }
                   else{
                     WrongCount++;
                   }
                  }
                  else if(resQuestionAnswer[counter].QuestionType === 4)
                  {
                    if(ans === userExamAnswer.AnswerId && userExamAnswer.TruePlaceClick)
                    {
                      new_userExamAnswer.TruePlaceToClick = 1;
                      CorrectCount++; 
                    }
                    else
                    {
                      WrongCount++; 
                    }

                  }
                  else{  // error 
                    console.log(".......Error Question......")
                    WrongCount++; 
                  }
                  
                  // if (
                  //  ( userExamAnswer.AnswerId === null ||  userExamAnswer.AnswerId === undefined ) &&
                  //   userExamAnswer.TruePlaceClick === true // sadece tıklanılacak yer var ise
                   
                  // ) {
                  //   new_userExamAnswer.TruePlaceToClick = 1;
                  //   CorrectCount++;
                  
                  // } else if (
                  //   ans === userExamAnswer.AnswerId && // sadece şık var ise
                  //  ( userExamAnswer.TruePlaceClick === null ||  userExamAnswer.TruePlaceClick === undefined)
                  // ) {
                  //   CorrectCount++;
                  //   new_userExamAnswer.TruePlaceToClick = 1;
                 
                  // } else if (
                  //   ans === userExamAnswer.AnswerId && // şık ve tıklanılanacak yer var ise
                  //   userExamAnswer.TruePlaceClick === true
                  // ) {
                  //   new_userExamAnswer.TruePlaceToClick = 1;
                  
                  //   CorrectCount++;
                  // } else {
                  //   new_userExamAnswer.TruePlaceToClick = null;
                  //   WrongCount++;
                  // }
                
                  counter ++;

                
                UserExamAnswer.createUserExamAnswer(
                  new_userExamAnswer,
                  function (err, result) {
                    if (err) {
                      res.status(400).send(err);
                    }
                  }
                );
              }
              console.log(CorrectCount,"cor",WrongCount)

              UserSuccessRate = (100 / (CorrectCount + WrongCount)) * CorrectCount;
              console.log(UserSuccessRate,"xxxxxxxxxxxxxxx")

              
              let cert = new Certificate({
                CreatorUserId: req.user.uid,
                UserId: req.user.uid,
                CCode: resUserExam[0].ExamCode,
                ExamId: resUserExam[0].ExamId,
              });

              Certificate.createCertificate(cert, function (err, cResult) {
                if (err) res.status(400).send(err);
                else {
                  UserExam.updateCountsandRatesByExamCode(
                    examCode,
                    CorrectCount,
                    WrongCount,
                    UserSuccessRate,
                    req.user.uid,
                    function (err, result) {
                      if (err) {
                        res.status(400).send(err);
                      }
                      res.json(result);
                    }
                  );
                }
              });
            }
          );

          // Graphical Question End
        }
      }
    });
  }
};

exports.read_a_userExamAnswer = function (req, res) {
  UserExamAnswer.getUserExamAnswerById(req.params.Id, function (err, result) {
    if (err) res.send(err);
    res.json(result[0]);
  });
};

exports.update_a_userExamAnswer = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  let userExamAnswer = new UserExamAnswer(req.body.userExamAnswer);

  userExamAnswer.LastModifierUserId = req.user.uid;

  UserExamAnswer.updateById(req.params.Id, userExamAnswer, function (
    err,
    result
  ) {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.delete_a_userExamAnswer = function (req, res) {
  if (!req.user) return res.status(400).send({ message: 'member not found' });

  UserExamAnswer.remove(req.params.Id, req.user.uid, function (err, result) {
    if (err) res.send(err);
    res.send(result);
  });
};
