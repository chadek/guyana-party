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
	  user: { type: [String], index: true },
	  name: { type: [String], index: true },
	  date: Date,
	  longitude: Number,
	  latitude: Number,
	  address: { type: [String], index: true },
		description: { type: [String], index: true },
	  flyer: String
	});

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
