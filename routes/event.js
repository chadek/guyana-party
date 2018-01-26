var express = require('express');
var router = express.Router();
var path = require('path');
var streamifier = require('streamifier');
var fs = require('fs');
var multer  = require('multer')
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

// connecting to db
var url = "mongodb://localhost:27017/guyana-party";
mongoose.connect(url, { useMongoClient: true });

var db = mongoose.connection;
var gfs = "";

// init gidfs (use to store data in db)
db.on('error', console.error.bind(console, 'error while connecting to DB'));
db.once('open',function(){
  gfs = Grid(db.db);
  console.log("connection to DB OK");
});


// require mongoose model (define in /model/models.js)
var models = require( path.join(__dirname, '../model/models' ))(mongoose);
var Event = models.Event;

// set destination for uploaded flyer
var upload = multer({ destination: 'flyers/' })

/*  ---------- GET JSON REQUEST ----- */

//return all event in json
router.get('/all', function(req, res, next) {
  console.log(req.user);
  Event.find( function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//send event
router.get('/id/:eventId/js', function(req, res, next) {
  // TODO get userName by querying mongo
  console.log(req.params.eventId);
  Event.findById(req.params.eventId,function(err, result) {
    if (err) {
      // error raised when id doesn't exist => raise 404 error (else throw exception)
      if (err.name == 'CastError') {
        var err = new Error('CastError');
        err.status = 404;
        next(err);
      } else {
        throw err;
      }
    } else if (result == null) {
	    	var err = new Error('Result Null');
        err.status = 404;
        next(err);
    } else {
      console.log(result);
      res.json(result);
    }
  });
});

/*  ---------- GET REQUEST ----- */

// display all event store in db on a map
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('evenement_mult', {user: req.user});
});


// render event page passing event id and user
// event id is used by front end js to query server with the event id
router.get('/id/:eventId', function(req, res, next) {
  // TODO get userName by querying mongo
  console.log(req.params.eventId);
  res.render('evenement', {user: req.user, event: req.params.eventId });
});


// delete event if user log in (delete also flyer)
router.get('/id/:eventId/delete', function(req, res, next) {
  if(req.user){
	  console.log(req.params.eventId);
	  // look for event to delete
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
	    // if not exist, throw error 404
	    } else if (result == null) {
	    	var err = new Error('Not Found');
        err.status = 404;
        next(err);
	    } else {
	      console.log(result);
	      // Only user that created the event can delete it
	      if (req.user == result.user){
	      	console.log("delete");
	      	// remove flyer if exist
      		if (result.flyer != 'noFlyer'){
    				gfs.remove({_id: result._id}, function (err) {
						  if (err) return handleError(err);
						  console.log('remove flyer successfully');
						});
      		} else {
      			console.log('no flyer to remove');
      		}
      		// remove event
	      	Event.remove({_id: result._id},function(err, result) {
	      		if (err) throw err;
			      res.render('suppr_evenement', {user: req.user, error: req.session.error});
	      	});
	      } else {
	      	// if bad user, display error
	      	req.session.error = 'notAllowed';
	      	res.render('suppr_evenement', {user: req.user, error: req.session.error});
	      	req.session.destroy();
	      }
	    }
	  });
	} else {
    res.redirect('/inscription');
	}
});


// return new event page if log else redirect to inscription page
router.get('/creation', function(req, res, next){
  if(req.user){
    res.render('creation_evenement', {user: req.user});
  } else {
    res.redirect('/inscription');
  }
});


/*  ---------- POST REQUEST ----- */
// Creat event with data send by user
router.post('/creation/ajouter', upload.single('flyer') ,function (req, res, next) {
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


        var dateStr = req.body.date+"T"+req.body.heure+":00";
        var dateObj = Date.parse(dateStr);
        console.log(dateStr);
        console.log(dateObj);

        var event = new Event({ user: req.user,
                                name: req.body.name,
                                date: dateObj,
                                longitude: req.body.longitude,
                                latitude: req.body.latitude,
                                address: req.body.address,
                                description: req.body.description,
                                flyer: file._id});
        console.log("CREATING EVENT (with flyer) :", req.body.name);
        event.save(function(err, result) {
          if (err) throw err;
          console.log("EVENT CREATED");
          res.redirect('/evenement/id/'+ result._id);
        });
      });
    } else {

      var dateStr = req.body.date+"T"+req.body.heure+":00";
      var dateObj = Date.parse(dateStr);
      console.log(dateStr);
      console.log(dateObj);
      // if no flyer, store null in flyer field
      var event = new Event({ user: req.user,
                              name: req.body.name,
                              date: dateObj,
                              longitude: req.body.longitude,
                              latitude: req.body.latitude,
                              address: req.body.address,
                              description: req.body.description,
                              flyer: 'noFlyer'});
      console.log("CREATING EVENT (without flyer) :", req.body.name);
      event.save(function(err, result) {
        if (err) throw err;
        console.log("EVENT CREATED");
        res.redirect('/evenement/id/'+ result._id);
      });
    }
  }else {
    res.redirect('/inscription');
  }
});


module.exports = router;
