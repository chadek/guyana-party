var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/guyana-party";
// Require the bcrypt package
var bcrypt = require('bcrypt');

// Create a password salt


function insertUser(newUser, newEmail, newPassword) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var saltString = bcrypt.genSaltSync(10);
    var myobj = { user: newUser, email: newEmail, password: bcrypt.hashSync(newPassword,saltString)};
    console.log(myobj);
    db.collection("user").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

function authentification(login, pwd) {
  var auth = false;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("user").findOne({email: login}, function(err, result) {
      if (err) throw err;
      db.close();
      return bcrypt.compareSync(pwd, result.password);
    });
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recherche', function(req, res, next) {
  res.render('recherche');
});

router.get('/inscription', function(req, res, next) {
  res.render('inscription');
});

router.get('/organisme', function(req, res, next) {
  res.render('organisme');
});

router.get('/evenement', function(req, res, next) {
  res.render('evenement');
});

router.get('/creation_evenement', function(req, res, next) {
  res.render('creation_evenement');
});

/* POST inscription */
router.post('/inscription/ajouter', function(req, res, next) {
  if(req.body.user != '' && req.body.email != '' && req.body.password != '') {
    // hash and salt user password before storing in database  
    insertUser(req.body.newUser, req.body.newEmail, req.body.newPassword);
    res.redirect('/');
  } else {
    res.redirect('/inscription');
  }
});

/* connection */
router.post('/connection', function(req, res, next) {
  if(req.body.login != '' && req.body.pwd != '' ) {
    // hash and salt user password before storing in database 
    console.log("-----"); 
    console.log(authentification(req.body.login, req.body.pwd));
    console.log("-----");
    if (authentification(req.body.login, req.body.pwd) == true) {
      res.redirect('/');
    } else {
      res.redirect('/inscription');
    }
  }
});

module.exports = router;
