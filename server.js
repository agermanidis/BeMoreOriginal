var request = require('request');
var express = require('express');

var app = express();

app.get('/is_original', function(req, res) {
    var q = req.query.q;
    request('https://twitter.com/search?q="'+encodeURIComponent(q)+'"', function(err, response, body) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.send(body.indexOf('original-tweet') == -1);
    });
});

app.listen(5141, function() {
  console.log("listening at http://agermanidis.com:5141");
});
