var express = require('express');
var router = express.Router();
var path = require('path');

var mongoose = require('mongoose');

// connecting to db
var url = "mongodb://localhost:27017/guyana-party";
mongoose.connect(url, { useMongoClient: true });

// require mongoose model (define in /model/models.js)
var models = require( path.join(__dirname, '../model/models' ))(mongoose);
var Organiz = models.Organiz;


/* GET users listing. */
router.get('/creation', function(req, res, next){
  if(req.user){
    res.render('creation_organization', {user: req.user});
  } else {
    res.redirect('/inscription');
  }
});

module.exports = router;