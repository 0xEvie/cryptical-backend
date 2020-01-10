var mongoose = require('mongoose');
var mongoConnect = require('../config/mongoConnect');

module.exports.connect = function ()
{
  mongoose.connect(mongoConnect.url, {useNewUrlParser: true});
  let db = mongoose.connection;
  return db;
};