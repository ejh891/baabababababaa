var fs = require('fs');
var express = require('express')
var app = express()

var readCounter = function() {
  var filename = __dirname + '/public/res/count.txt';
  var content = fs.readFileSync(filename, 'utf-8');
  var count = parseInt(content, 10);
  if (count === NaN) {
    console.error('Count could not be parsed');
    return 0;
  }

  return count;
};

var writeCounter = function(newCount) {
  var filename = __dirname + '/public/res/count.txt';
  fs.writeFileSync(filename, newCount, 'utf-8');
};

app.use('/', express.static(__dirname + '/public'));

app.post('/incrementCounter', function(req, res) {
  var count = readCounter();
  count++;
  writeCounter(count);
});

app.get('/readCounter', function(req, res) {
  var data = {};
  data.count = readCounter();
  res.json(data);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});