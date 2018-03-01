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
var Organiz = models.Organiz;
var Admin = models.Admin;
var Member = models.Member;

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

router.get('/id/:organizId', function(req, res, next){

	console.log('ID of ORGANIZATION '+ req.params.organizId);

	Organiz.findOne({_id: req.params._id}, function(err, result){
		if (err) throw err;
		if(null != result){
			var organizFound = {
				name: result.name,
				logo: result.logo,
				type: result.type,
				description: result.description,
				address: result.address,
			};
			console.log('info a afficher', organizFound);
			res.render('organization', {
				user: req.user,
				organizInfos: organizFound
			});
		} else {
			var err= new Error('Not Found');
			err.status = 404;
			next(err);
		}
	})
	

});



/*  ---------- POST REQUEST ----- */
// Creat organiz with data send by user
router.post('/creation/ajouter', upload.single('logo') ,function (req, res, next) {
	console.log("ajout");
	console.log(req.body);
	console.log(req.file);
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
					longitude: req.body.longitude,
					latitude: req.body.latitude,
					address: req.body.address
				});

				console.log("CREATING ORGANIZATION (with logo) :", req.body.name);
				
				organiz.save(function(err, result) {
					if (err) throw err;
					console.log("ORGANIZATION CREATED");
					res.redirect('/organization/id/'+ result._id);
				});


				/*console.log("Adding  user right !");

				var admin = new Admin({
					userID: req.user,
					organizId: result._id
				});

				admin.save(function(erra, resulta){
					if (erra) throw erra;
					console.log("Added as administrator");
				});

				var membre = new Member({
					userID: req.user,
					organizId: result._id
				});

				membre.save(function(errm, resultm){
					if (errm) throw errm;
					console.log("Added as member too");
				});*/

				

				
				
			});
		} else {


			// if no logo, store null in flyer field
			var organiz = new Organiz({ 
				name: req.body.name,
				logo: 'noLogo',
				type: req.body.type_orga,
				description: req.body.description,
				longitude: req.body.longitude,
				latitude: req.body.latitude,
				address: req.body.address
			});

			console.log("CREATING ORGANIZ (without logo) :", req.body.name);
			organiz.save(function(err, result) {
				if (err) throw err;
				console.log("ORGANIZ CREATED");
				// is a admin too, so
				res.redirect('/organization/id/'+ result._id);
			});

			/*var admin = new Admin({
				userID: req.user,
				organizId: result._id
			});

			var membre = new Member({
				userID: req.user,
				organizId: result._id
			});

			console.log("Adding  user right !");

			admin.save(function(erra, resulta){
				if (erra) throw erra;
				console.log("Added as administrator");
			});

			membre.save(function(errm, resultm){
				if (errm) throw errm;
				console.log("Added as member too");
			});*/
		}
	}else {
		res.redirect('/inscription');
	}
});

module.exports = router;
