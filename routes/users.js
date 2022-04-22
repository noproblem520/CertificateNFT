const { application } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../model/db.config.js');


router.get('/user/:id', loginCheck, (req, res, next) => {
  // sql查詢user表

  db.select([req.params.id], function (results, fields) {
    // 以json的形式返回

    // res.json({ results });
    res.render('index', { title: "DB_DEMO", result: results });

  });
});

router.get('/user', loginCheck, (req, res, next) => {
  // sql查詢user表
  db.select([], function (results, fields) {
    // 以json的形式返回

    // res.json({ results });
    res.render('index', { title: "DB_DEMO", result: results });

  });
});

router.put('/user', (req, res, next) => {
  // sql查詢user表
  db.update([req.body.v1, req.body.v2, req.body.PK], function (results, fields) {
    // 以json的形式返回
    res.render('index', { title: "DB_DEMO", result: results });
  });
});

router.delete('/user', (req, res, next) => {
  // sql查詢user表

  db.delete([req.body.PK], function (results, fields) {
    // 以json的形式返回

    // res.json({ results });
    res.render('index', { title: "DB_DEMO", result: results });

  });
});

router.post('/user', (req, res, next) => {
  // sql查詢user表

  db.insert([req.body.v1, req.body.v2], function (results, fields) {
    // 以json的形式返回

    // res.json({ results });
    res.render('index', { title: "DB_DEMO", result: results });

  });
});


function loginCheck(req, res, next) {
  next();
}


router.get('/index',(req,res,next)=>{
  res.render('releaseNFT1');
})

module.exports = router;