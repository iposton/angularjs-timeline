var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8082;

app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the home page route
app.get('/', function(req, res) {
    res.render('index');
});


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});