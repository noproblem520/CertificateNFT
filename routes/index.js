var express = require('express');
var router = express.Router();
var db = require('../model/db.config.js')
/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'login page',
    returnMsg: ""
  });
});


router.post('/login', function (req, res, next) {

  db.checkAccount([req.body.account, req.body.password], function (results, fields) {
    // 以json的形式返回


    if (results[0] == undefined) {
      let returnMsg = "Wrong account or password";
      res.render('login', { title: "login page", returnMsg: returnMsg });
    } else {
      res.redirect('/users/user');
    }


  })
});


router.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function (req, res) {
  res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function (err) {
      if (err) res.send(404);
  });
});

router.get('/test', function (req, res, next) {
  res.send("Hello test");
});

router.get('/releaseNFT1', function (req, res, next) {
  res.render("releaseNFT1");
});



module.exports = router;
