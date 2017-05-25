var mongoose = require('mongoose');

var dbUser = process.env.DBUSER || 'dev';
var dbPass = process.env.DBPASS || 'friskydingo';
mongoose.connect('mongodb://' + dbUser + ':' + dbPass + '@ds153521.mlab.com:53521/baabababababaa');

var bababasSchema = mongoose.Schema({
    count : { type: mongoose.Schema.Types.Number, required: true }
});

var Bababas = mongoose.model('bababas', bababasSchema);

module.exports = Bababas;