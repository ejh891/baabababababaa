var fs = require('fs');
var express = require('express')
var app = express()

var BababasDb = require('./db/bababas');
var Bababa = BababasDb; // BababasDb object overloaded as constructor; split it up

var COUNT;

var readCounter = function(callback) {
    if (COUNT !== undefined) {
      var result = {};
      result._doc = {};
      result._doc.count = COUNT;
      callback(undefined, result);
    }
    else {
      BababasDb.findOne({}, callback);
    }
};

var writeCounter = function(newCount) {
    BababasDb.findOneAndUpdate({}, {count: newCount}, function(err, counter) {
        if (err) {
          console.log(err);
        } else {
          COUNT++;
        }
    });
};

app.use('/', express.static(__dirname + '/public'));

app.post('/incrementCounter', function(req, res) {
  writeCounter(COUNT + 1);
});

app.get('/readCounter', function(req, res) {
  var data = {};
  readCounter(function(err, result) {
      if (err) { 
        console.log(err);
      }
      else if (!result) {
        console.log('No documents found in database');
      }
      else {
        COUNT = result._doc.count;
        data.count = COUNT;
        res.json(data);
      }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});