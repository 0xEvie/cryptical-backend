var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
var UserSchema = Schema({
  email: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
