const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

//var path = require('path');
//var passport = require( path.join(__dirname, "../Utils/auth" ) );
//var mongoose = require('mongoose');
//var url = "mongodb://localhost:27017/guyana-party";
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;

// mongoose.connect(url, { useMongoClient: true });

// var db = mongoose.connection;
// var gfs = "";

// db.on('error', console.error.bind(console, 'error while connecting to DB'));
// db.once('open',function(){
//   gfs = Grid(db.db);
//   console.log("connection to DB OK");
// });

// // require mongoose model (define in /model/models.js)
// var models = require( path.join(__dirname, '../model/models' ))(mongoose);
// var Event = models.Event;

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', {user: req.user });
// });

// // get instription page : if user log, redirect to main page, else render template
// router.get('/inscription', function(req, res, next) {
//   if(req.isAuthenticated()){
//     res.redirect('/');
//   } else{
//     // render template with errors throw by bad login/register
//     res.render('inscription', {status: req.session.error || [], errorCause: req.session.errorCause });
//     req.session.destroy();
//   }
// });

// // render organisme page (redirect to login page if not log)
// router.get('/organisme', function(req, res, next) {
//   if(req.isAuthenticated()){
//     res.render('organisme');
//   } else {
//     res.redirect('/inscription');
//   }
// });

// // get file from id (streaming)
// router.get('/file/:fileId', function(req, res, next) {
//   //read from mongodb
//   console.log("get file");
//   var readStream = gfs.createReadStream({
//        _id: req.params.fileId
//   });

//   readStream.on('open', function () {
//     // This just pipes the read stream to the response object (which goes to the client)
//     readStream.pipe(res);
//   });

//   // This catches any errors that happen while creating the readable stream (usually invalid names) and raise 404 error
//   readStream.on('error', function(err) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
//   });
// });

// // deconnexion de l'utilisateur
// router.get('/deconnexion', function(req, res){
//   var name = req.user;
//   console.log("LOGGIN OUT " + req.user)
//   req.logout();
//   res.redirect('/');
//   req.session.notice = "You have successfully been logged out " + name + "!";
// });

// /* POST inscription */
// router.post('/inscription/ajouter', passport.authenticate('local-signup', { failureRedirect: '/inscription'}),
//   function(req, res) {
//     res.redirect('/users/'+req.user);
// });

// /* connection */
// router.post('/connection', passport.authenticate('local-signin', { failureRedirect: '/inscription'}),
//   function(req, res) {
//     res.redirect('/users/'+req.user);
//   }
// );

router.get("/", mainController.homePage);
router.get("/connexion", userController.connexionForm);

module.exports = router;
