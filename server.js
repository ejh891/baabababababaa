var fs = require('fs');
var express = require('express')
var app = express()

app.use('/', express.static(__dirname + '/public'));

app.post('/incrementCounter', function(req, res) {
  var filename = __dirname + '/public/res/count.txt';
  var content = fs.readFileSync(filename, 'utf-8');
  var count = parseInt(content, 10);
  if (count === NaN) {
    console.error('Count could not be parsed');
    return;
  }
  count++;
  fs.writeFileSync(filename, count, 'utf-8');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
});