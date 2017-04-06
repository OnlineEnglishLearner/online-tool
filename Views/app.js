
var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/teacher', express.static(path.join(__dirname, 'public/HTML/')));
app.use('/student', express.static(path.join(__dirname, 'public/HTML/')));

app.get('/teacher', function (req, res) {
  res.redirect('./teacherInput.html')
});

app.get('/', function (req, res) {
  res.redirect('student/studentView.html')
});

app.get('/student/:title', function (req, res) {
  res.send(req.params)
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
