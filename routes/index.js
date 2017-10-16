var express = require('express');
var router = express.Router();
var path = require('path');

var passport = require( path.join(__dirname, "../Utils/auth" ) ); 
var streamifier = require('streamifier');
var fs = require('fs');
var multer  = require('multer')

var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/guyana-party";

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


var upload = multer({ destination: 'flyers/' })


mongoose.connect(url, { useMongoClient: true });

var db = mongoose.connection;
var gfs = "";

db.on('error', console.error.bind(console, 'error while connecting to DB'));
db.once('open',function(){
  gfs = Grid(db.db);
  console.log("connection to DB OK");
});


// require mongoose model (define in /model/models.js)
var models = require( path.join(__dirname, '../model/models' ))(mongoose);
var Event = models.Event;





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user });
});

router.get('/recherche', function(req, res, next) {
  res.render('recherche', {user: req.user });
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

// display all event
router.get('/evenement', function(req, res, next) {
  console.log(req.user);
  Event.find( function(err, result) {
    if (err) throw err;
    console.log(result);
    res.render('evenement_mult', {user: req.user, event: result });
  });

});

// display event from id
router.get('/evenement/:eventId', function(req, res, next) {
  
  // TODO get userName by querying mongo
  console.log(req.params.eventId);
  Event.findById(req.params.eventId,function(err, result) {
    if (err) {
      // error raised when id doesn't exist => raise 404 error (else throw exception)
      if (err.name == 'CastError') {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      } else {
        throw err;
      }
    } else {
      console.log(result);
      res.render('evenement', {user: req.user, event: result });
    }

  });

});

// get file from id (streaming)
router.get('/file/:fileId', function(req, res, next) {
  //read from mongodb
  console.log("get file");
  var readStream = gfs.createReadStream({
       _id: req.params.fileId
  });

  readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });

  // This catches any errors that happen while creating the readable stream (usually invalid names) and raise 404 error
  readStream.on('error', function(err) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
});



// page de création d'événement
router.get('/creation_evenement', function(req, res, next){ 
  if(req.user){
    res.render('creation_evenement');
  } else {
    res.redirect('/inscription');
  } 
});

// deconnexion de l'utilisateur
router.get('/deconnexion', function(req, res){
  var name = req.user;
  console.log("LOGGIN OUT " + req.user)
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
router.post('/creation_evenement/ajouter', upload.single('flyer') ,function (req, res, next) { 
  console.log("ajout");
  console.log(req.body);
  console.log(req.file);
  // if user is logged
  if(req.user){
    // if user send flyer, store it in db
    if (req.file != undefined){
      // streaming to gridfs
      //filename to store in mongodb
      var writestream = gfs.createWriteStream({
          mode: 'w',
          filename: req.file.originalname 
      });
      streamifier.createReadStream(req.file.buffer).pipe(writestream);
      
      writestream.on('close', function (file) {
        // do something with `file`
        console.log(file.filename + ' Written To DB');

        console.log("newEvent");    
        var event = new Event({ user: req.user, 
                                name: req.body.name, 
                                date: req.body.date, 
                                heure: req.body.heure, 
                                longitude: req.body.longitude, 
                                latitude: req.body.latitude, 
                                address: req.body.address, 
                                flyer: file._id});
        console.log("CREATING EVENT (with flyer) :", req.body.name);
        event.save(function(err, result) {
          if (err) throw err;
          console.log("EVENT CREATED");
          res.redirect('/evenement/'+ result._id);
        });
      });
    } else {
      // if no flyer, store null in flyer field
      var event = new Event({ user: req.user, 
                                name: req.body.name, 
                                date: req.body.date, 
                                heure: req.body.heure, 
                                longitude: req.body.longitude, 
                                latitude: req.body.latitude, 
                                address: req.body.address, 
                                flyer: 'noFlyer'});
      console.log("CREATING EVENT (without flyer) :", req.body.name);
      event.save(function(err, result) {
        if (err) throw err;
        console.log("EVENT CREATED");
        res.redirect('/evenement/'+ result._id);
      });
    }
  }else {
    res.redirect('/inscription');
  } 

});

module.exports = router;