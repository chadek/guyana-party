//====Mongoose model==== 
module.exports = function(mongoose) {

//==Mongoose model==
	var userSchema = mongoose.Schema({
	  user: String,
	  email: String,
	  password: String
	});

	var eventSchema = mongoose.Schema({
	  user: String,
	  name: String,
	  date: String,
	  heure: String,
	  longitude: String,
	  latitude: String,
	  address: String,
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