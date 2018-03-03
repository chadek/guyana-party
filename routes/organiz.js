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

db.on('error', console.error.bind(console, 'error while connecting to DB'));
db.once('open',function(){
	gfs = Grid(db.db);
	console.log("connection organiz to DB OK");
});


// require mongoose model (define in /model/models.js)
var models = require( path.join(__dirname, '../model/models' ))(mongoose);
var User = models.User;
var Organiz = models.Organiz;


// set destination for uploaded flyer
var upload = multer({ destination: 'logos/' })


/* GET users listing. */
router.get('/creation', function(req, res, next){
	if(req.isAuthenticated()){
		res.render('creation_organization', {user: req.user});
	} else {
		res.redirect('/inscription');
	}
});

/*----- GET REQUEST -----*/

router.get('/id/:organizId/js', function(req, res, next){
	console.log(req.params.organizId);
	Organiz.findById(req.params.organizId, function(err, result){
		if (err) {
			if (err.name == 'CastError') {
				var err = new Error('CastError');
				err.status = 404;
				next(err);
			} else {
				throw err;
			}
		} else if (result == null){
			var err = new Error('Result Null');
			err.status = 404;
			next(err);
		} else {
			console.log(result);
			res.json(result);
		}
	});
});

router.get('/id/:organizId', function(req, res, next){
	console.log('ID of ORGANIZATION '+ req.params.organizId);
	console.log('Username : ' +  req.user);
	res.render('organization', {user: req.user, organiz: req.params.organizId});
});



/*  ---------- POST REQUEST ----- */
// Creat organiz with data send by user
router.post('/creation/ajouter', upload.single('logo') ,function (req, res, next) {
	console.log("ajout");
	console.log(req.body);
	console.log(req.file);
	console.log(req.user);
	// if user is logged
	if(req.isAuthenticated()){
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

				var organiz = new Organiz({ 
					name: req.body.name,
					logo: file._id,
					type: req.body.type_orga,
					description: req.body.description,
					address: req.body.address,
					longitude: req.body.longitude,
					latitude: req.body.latitude,
					community : [{username: req.user, isAdmin: true}]
				});

				console.log("CREATING ORGANIZATION (with logo) :", req.body.name);

				organiz.save(function(err, result) {
					if (err) throw err;
					console.log("ORGANIZATION CREATED");

					console.log("Adding  user right !");
					
					User.updateOne({user: req.user},{$push : {membership: result._id}}, function(err, res) {
						if (err) throw err;
						console.log("1 document updated");
					});

					res.redirect('/organization/id/'+ result._id);
				});	
			});
		} else {


			// if no logo, store null in flyer field
			var organiz = new Organiz({ 
				name: req.body.name,
				logo: 'noLogo',
				type: req.body.type_orga,
				description: req.body.description,
				address: req.body.address,
				longitude: req.body.longitude,
				latitude: req.body.latitude,
				community : [{username: req.user, isAdmin: true}]
			});

			console.log("CREATING ORGANIZ (without logo) :", req.body.name);
			organiz.save(function(err, result) {
				if (err) throw err;
				console.log("ORGANIZ CREATED");

				User.findOneAndUpdate({user: req.user},{$push : {membership: result._id}});

				res.redirect('/organization/id/'+ result._id);
			});


		}
	}else {
		res.redirect('/inscription');
	}
});

module.exports = router;
