var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NeoSchema = new Schema({
	date: Date,
	name: String,
	magnitude: Number,
	diamter: Number,
	velocity: Number,
	distance: Number
});	

var Neo = mongoose.model('Neo', NeoSchema);
module.exports = Neo;