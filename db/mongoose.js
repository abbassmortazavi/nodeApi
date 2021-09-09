let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://admin:admin@localhost:27017/admin');
mongoose.connect('mongodb://admin:admin@localhost:27017/admin');

module.exports = {mongoose};
