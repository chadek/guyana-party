//====Mongoose model====
module.exports = function(mongoose) {

//==Mongoose model==
	var userSchema = mongoose.Schema({
		user: String,
		email: String,
		password: String,
		picture: String,
		isvalid: Boolean
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

	var organizSchema = mongoose.Schema({
		name : String,
		logo: String,
		type : String,
		description: String,
		address: String,
		longitude: Number, 
		latitude: Number,
		admin: [String],
		member:[String]
	});

	// create index to perform text search on several fields
	eventSchema.index({user: 'text', name: 'text', description:'text', address: 'text'});

  // try to get model, if doesn't exit then init with schema
  let models
  try {
	    models = {
			User: mongoose.model('User'),
			Event: mongoose.model('Event'),
			Organiz: mongoose.model('Organiz')
	    };
	} catch (error) {
		models = {
			User: mongoose.model('User', userSchema),
			Event: mongoose.model('Event', eventSchema),
			Organiz: mongoose.model('Organiz', organizSchema)
		};
	}
    return models;
}
