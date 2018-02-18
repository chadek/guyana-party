//====Mongoose model====
module.exports = function(mongoose) {

//==Mongoose model==
	var userSchema = mongoose.Schema({
	  user: String,
	  email: String,
	  password: String,
		type: String //organisme
	});

	var eventSchema = mongoose.Schema({
	  user: String,
	  name: String,
	  date: Date,
	  longitude: Number,
	  latitude: Number,
	  address: String,
		description: String,
	  flyer: String
	});
	// create index to perform text search on several fields
	eventSchema.index({user: 'text', name: 'text', description:'text', address: 'text'});

  // try to get model, if doesn't exit then init with schema
  let models
  try {
	    models = {
			User: mongoose.model('User'),
			Event: mongoose.model('Event')
	    };
	} catch (error) {
		models = {
			User: mongoose.model('User', userSchema),
			Event: mongoose.model('Event', eventSchema)
	    };
	}
    return models;
}
