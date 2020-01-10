var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
  title: {type: String, default: ''},
  startdatetime: {type: Date, default: ''}, // /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/
  enddatetime: {type: Date, default: ''}, // /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/
  notes: {type:String, default: ''},
  user: {type: Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('UserEvent', EventSchema);
