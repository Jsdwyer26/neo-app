var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NeoInfoSchema = new Schema({
	neoId: Number,
	neoName: String,
});

var NeoInfo = mongoose.model('NeoInfo', NeoInfoSchema);
module.exports = NeoInfo;