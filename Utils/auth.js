var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var sanitize = require('mongo-sanitize');
var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

// connecting to db
var url = "mongodb://localhost:27017/guyana-party";
mongoose.connect(url, { useMongoClient: true });

// require mongoose model (define in /model/models.js)
var models = require( path.join(__dirname, '../model/models' ))(mongoose);
var User = models.User;


// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});


// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  { usernameField: 'login', passwordField: 'pwd',passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {

    // prevent noSQL injection
    username = sanitize(username);
    password = sanitize(password);

    console.log("localSignin");

    // look for the email
    User.findOne({email: username}, function(err, result) {

      console.log("USERNAME input :", username);
      if (err) throw err;
      // if no match retrun false (auth fail)
      if (null == result) {
        console.log("USERNAME NOT FOUND:", username);
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        req.session.errorCause = 'badLog';
        done(null, false);

      } else {
        console.log("FOUND USER: " + result.email);
        // compare pwd to pwd store in db
        if (bcrypt.compareSync(password, result.password)){
          console.log("LOGGED IN AS: " + result.user);
          // sending back user mail as data for cookie (could be also id)

          done(null, result.user);
        } else {
          console.log("AUTHENTICATION FAILED");
          req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
          req.session.errorCause = 'badLog';
          done(null, false);
        }
      }
    });
  }
));


// Use the LocalStrategy within Passport to register users.
passport.use('local-signup', new LocalStrategy(
  {usernameField: 'newUser', passwordField: 'newPassword', passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username,  password, done) {


    // prevent noSQL injection
    email = sanitize(req.body.newEmail);
    username = sanitize(username);
    password = sanitize(password);
    checkPassword = sanitize(req.body.renewPassword)

    if (password != checkPassword){
      console.log("PASSWORDS DOESN'T MATCH");
      req.session.error = 'Passwords does not match, please try again'; //inform user could not log them in
      req.session.errorCause = 'password';
      done(null, false);
      return
    }

    console.log("localReg");
    // look for the username
    User.findOne({user: username}, function(err, result) {

      console.log("USERNAME input :", username);
      if (err) throw err;
      // if no match retrun false (auth fail)
      if (null == result) {
        //look for email
        User.findOne({email: email},function(err, result) {
          if (err) throw err;
          if (null == result) {

            // salt and hash password before sending it to database
            password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            var user = new User({ user: username, email: email, password: password, type: req.body.type_orga});

            console.log("CREATING USER:", username);

            user.save(function(err, res) {
              if (err) throw err;
              console.log("USER CREATED");
              done(null, user.user);
            });

          } else {
            console.log("EMAIL ALREADY EXIST:", result.email);
            req.session.error = 'That email is already in use, please try a different one.'; //inform user could not log them in
            req.session.errorCause = 'email';
            done(null, false);
          }
        });

      } else {
        console.log("USER ALREADY EXIST: " + result.user);
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        req.session.errorCause = 'user';
        done(null, false);
      }
    });
  }
));

module.exports = passport;





/*

// ====Gestion d'utilisateur===//
// creation d'utilisateur
function localReg(newUser, newEmail, newPassword) {
  // prevent noSQL injection
  newUser = sanitize(newUser);
  newEmail = sanitize(newEmail);
  newPassword = sanitize(newPassword);

  console.log("localReg");
  //promise declaration
  var deferred = Q.defer();
  //connect to db
  User.findOne({user: newUser},function(err, result) {
    if (err) throw err;
    if (null != result) {
      console.log("EMAIL ALREADY EXIST:", result.email);

      deferred.resolve(0);
    } else {
      User.findOne({email: newEmail},function(err, result) {
        if (err) throw err;
        if (null != result) {
          console.log("USERNAME ALREADY EXIST:", result.user);

          deferred.resolve(1);
        } else {
          // salt and hash password before sending it to database
          newPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
          var user = new User({ user: newUser, email: newEmail, password: newPassword});

          console.log("CREATING USER:", newUser);

          user.save(function(err, res) {
            if (err) throw err;
            console.log("USER CREATED");
            deferred.resolve(user);
          });
        }
      });
    }
  });
  return deferred.promise;
}

// authentification d'utilisateur
function localAuth(login, pwd) {
  // prevent noSQL injection
  login = sanitize(login);
  pwd = sanitize(pwd);

  console.log(login);
  //promise declaration
  var deferred = Q.defer();
  //connect to db

  User.findOne({email: login}, function(err, result) {

    console.log("USERNAME NOT FOUND:", login);
    if (err) throw err;
    if (null == result) {
      console.log("USERNAME NOT FOUND:", login);

      deferred.resolve(false);
    } else {
      console.log("FOUND USER: " + result.user);
      // compare pwd to pwd store in db
      if (bcrypt.compareSync(pwd, result.password)){
        deferred.resolve(result);
      } else {
        console.log("AUTHENTICATION FAILED");
        deferred.resolve(false);
      }
    }
  });
  // return promise
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

*/
