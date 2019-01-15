var mongoose = require('mongoose');

mongoose.set('debug',true);
//mongoose.connect('mongodb://phirmware:itachi1@ds135061.mlab.com:35061/crypto');
//mongoose.connect('mongodb://localhost/trouble', { useNewUrlParser: true });
mongoose.connect('mongodb://phirmware:itachi1@ds237120.mlab.com:37120/iservice');

mongoose.Promise = Promise;

module.exports.user = require('./user');
module.exports.problem = require('./problem')