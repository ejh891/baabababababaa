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

var writeCounter = function(newCount, callback) {
    BababasDb.findOneAndUpdate({}, {count: newCount}, callback);
};

var subscribers = [];
setInterval(function() {
  var subscriberIds = subscribers.map(function(o) { return o.id });
  console.log("subscribers: " + subscriberIds.toString());
}, 3*1000);

// process each subscriber and send the latest count
var notifySubscribers = function() {
  while (subscribers.length > 0) {
    var subscriber = subscribers.shift();
    clearTimeout(subscriber.timeoutId);
    console.log("subscriber: " + subscriber.id + " was notified");
    var data = {};
    data.count = COUNT;
    subscriber.res.json(data);
  }
}

app.use('/', express.static(__dirname + '/public'));

app.post('/incrementCounter', function(req, res) {
  writeCounter(COUNT + 1, function(err, counter) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          COUNT++;
          notifySubscribers();
          res.sendStatus(200);
        }
    });
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

var subscriberId = 0;
app.get('/subscribeToCounter', function(req, res) {
  var subscriber = {
    id: subscriberId++,
    res: res,
    timeoutId: setTimeout(function () {
      console.log("subscriber: " + subscriber.id + " timed out");
      var subscriberIndex = subscribers.indexOf(subscriber);
      if (subscriberIndex !== -1) {
        subscribers.splice(subscriberIndex, 1);
        subscriber.res.json({});
      }
    }, 25*1000)
  };
  console.log("registered subscriber: " + subscriber.id);
  subscribers.push(subscriber);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});