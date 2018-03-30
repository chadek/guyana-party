const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

// var path = require('path');

// var mongoose = require('mongoose');

// // connecting to db
// var url = "mongodb://localhost:27017/guyana-party";
// mongoose.connect(url, { useMongoClient: true });

// // require mongoose model (define in /model/models.js)
// var models = require( path.join(__dirname, '../model/models' ))(mongoose);
// var User = models.User;

// /* GET users listing. */
// router.get('/:username', function(req, res, next) {
// 	User.findOne({user: req.params.username}, function(err, result) {
// 	    if (err) throw err;
// 	    if (null != result) {
// 	    	var userFound = {user: result.user, email: result.email, type: result.type}
// 	    	res.render('user',{user: req.user , userProfil: userFound});
// 		} else {
// 	        var err = new Error('Not Found');
//         	err.status = 404;
//         	next(err);
// 		}
// 	});
// });var path = require('path');

// var mongoose = require('mongoose');

// // connecting to db
// var url = "mongodb://localhost:27017/guyana-party";
// mongoose.connect(url, { useMongoClient: true });

// // require mongoose model (define in /model/models.js)
// var models = require( path.join(__dirname, '../model/models' ))(mongoose);
// var User = models.User;

// /* GET users listing. */
// router.get('/:username', function(req, res, next) {
// 	User.findOne({user: req.params.username}, function(err, result) {
// 	    if (err) throw err;
// 	    if (null != result) {
// 	    	var userFound = {user: result.user, email: result.email, type: result.type}
// 	    	res.render('user',{user: req.user , userProfil: userFound});
// 		} else {
// 	        var err = new Error('Not Found');
//         	err.status = 404;
//         	next(err);
// 		}
// 	});
// });

//TODO route to edit event (allow only owner by checking cookie => req.user)

//TODO route to display user event

//TODO route to update user information

//TODO

module.exports = router;
