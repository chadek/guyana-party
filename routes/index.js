var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/guyana-party";
// Require the bcrypt package
var bcrypt = require('bcrypt');
var Q = require('q');
var passport = require('passport');
var LocalStrategy = require('passport-local');

//===============MONGODB=================

// ====Gestion d'utilisateur===//
// creation d'utilisateur
function localReg(newUser, newEmail, newPassword) {
  console.log("localReg");
  var deferred = Q.defer();
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection("user");
    collection.findOne({email: newEmail}, function(err, result) {
        if (null != result) {
          console.log("EMAIL ALREADY EXIST:", result.email);

          deferred.resolve(0);
        } else {
          collection.findOne({user: newUser}, function(err, result) {
            if (null != result) {
              console.log("USERNAME ALREADY EXIST:", result.user);

              deferred.resolve(1);
            } else {
              var saltString = bcrypt.genSaltSync(10);
              var myobj = { user: newUser, email: newEmail, password: bcrypt.hashSync(newPassword,saltString)};
 
              console.log("CREATING USER:", newUser);

              db.collection("user").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("USER CREATED");
                db.close();
                deferred.resolve(myobj);
              });
            }
          });
        }
     });
  });
  return deferred.promise;
}
  
// authentification d'utilisateur
function localAuth(login, pwd) {
  console.log(login);
  var deferred = Q.defer();
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection("user");
    collection.findOne({email: login}, function(err, result) {
        if (err) throw err;
        if (null == result) {
          console.log("USERNAME NOT FOUND:", login);

          deferred.resolve(false);
        } else {
          console.log("FOUND USER: " + result.user);
          if (bcrypt.compareSync(pwd, result.password)){
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(false);
          }
        }
        db.close();
      });
  });
  return deferred.promise;
}


//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj.user);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  { usernameField: 'login', passwordField: 'pwd',passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    console.log("test");
    localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.user);
        req.session.success = 'You are successfully logged in ' + user.user + '!';
        console.log("LOGGED IN AS: " + user.user);
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        req.session.errorCause = 'badLog';
        done(null, user);
      }
    })
    .fail(function (err){
      console.log("erreur");
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {usernameField: 'newUser', passwordField: 'newPassword', passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username,  password, done) {
    localReg(username, req.body.newEmail, password)
    .then(function (user) {
      if (user == 0) {
        console.log("COULD NOT REGISTER USER");
        req.session.error = 'That email is already in use, please try a different one.'; //inform user could not log them in
        req.session.errorCause = 'email';
        done(null, false);
      }
      else if (user == 1) {
        console.log("COULD NOT REGISTER EMAIL");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        req.session.errorCause = 'user';
        done(null, false);
      }
      else if (user) {
        console.log("REGISTERED: " + user.user);
        req.session.success = 'You are successfully registered and logged in ' + user.user + '!';
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.render('index', {user: 'log' });
  } else{
    res.render('index', { user: '' });
  }
});

router.get('/recherche', function(req, res, next) {
  if(req.user){
    res.render('recherche', {user: 'log' });
  } else{
    res.render('recherche', {user: '' });
  }
});


router.get('/inscription', function(req, res, next) {
  if(req.user){
    res.redirect('/');
  } else{
    res.render('inscription', {status: req.session.error || [], errorCause: req.session.errorCause });
    req.session.destroy();
  }
});

router.get('/organisme', function(req, res, next) {
  if(req.user){
    res.render('organisme');
  } else {
    res.redirect('/inscription');
  } 
});

router.get('/evenement', function(req, res, next) {
  if(req.user){
    res.render('evenement', {user: 'log' });
  } else{
    res.render('evenement', {user: '' });
  }  
});

router.get('/creation_evenement', function(req, res, next){ 
  if(req.user){
    res.render('creation_evenement');
  } else {
    res.redirect('/inscription');
  } 
});

router.get('/deconnexion', function(req, res){
  var name = req.user.user;
  console.log("LOGGIN OUT " + req.user.user)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});


/* POST inscription */
router.post('/inscription/ajouter', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/inscription'
  })
);

/* connection */
router.post('/connection', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/inscription'
  })
);

/* creation d'evenement */
router.post('/creation_evenement/ajouter', function(req, res, next){ 
  if(req.user){
    res.render('creation_evenement');
  } else {
    res.redirect('/inscription');
  } 
});

module.exports = router;
