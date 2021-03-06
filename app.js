var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var parser = require('parser'); // write for parse csv to JSON
var reader = require('readfile');// module for read file
var app = express();

app.set('port', 3000)
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')))

/* index file for start page */ 
app.get('/', function(req, res, next){
  res.render("index")
});

var parseJson = {} // made it global for use JSON to send data
app.post('/upload', function(req, res, next){
  reader.readFile(req, res,  function(data){
    parseJson = parser.csvJSON(data);
    // render not Json, but string, cause it more convenient for table view
    data = data.split('\n');  
    res.render("file", { data: data});
  })
});

// in case not used DB I used parseJson[req.body.id] to find appropriate object in array by id from DOM
app.post('/add_user', function(req, res){
   var data = parseJson[req.body.id];
   // probably need to retreive (for in) each key in data and map it with jsonObject 
   var jsonObject = JSON.stringify({
      name: data['name'],
      paymentTermsId: data['payment terms'] !== ' ' ?  data['payment terms'] : 1 ,
      email: data['email'],
      phone: data['phone'],
      countryCode: data['country']
   })
   var postheaders = {
     'Content-Type' : 'application/json',
     'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
   }
   var optionspost = {
     host : 'api.debitoor.com',
     port : 443,
     path : '/api/v1.0/customers?access_token=eyJ1c2VyIjoiNTJhNDYzN2ZlYzU4OGJlZTEyMDA3MTkyIiwiYXBwIjoiNTJhNDYzZjdlYzU4OGJlZTEyMDA3MTlhIiwiY2hhbGxlbmdlIjowLCIkZSI6MH0Kwq06YScNCFvCm8ORwpDDisKRwoxCwqjDlA?autonumber=true',
     method : 'POST',
     headers: postheaders
  };
  var body = "";
  var reqPost = https.request(optionspost, function(response) {
    response.on('data', function(d) {
   process.stdout.write(d)
        body += d;
    });
    response.on('end', function() {
        res.render('answer', {body : body} ) 
    });
  })
  reqPost.write(jsonObject);
  reqPost.end();
  reqPost.on('error', function(e) {
    console.error(e);
  });
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(function(req, res){
   res.send(404, "Not found");
});
