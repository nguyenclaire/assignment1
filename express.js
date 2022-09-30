var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');

//global variable for tweet data
var tweetinfo = []
var tweetsearch = []

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err, data) {
  if (err) {
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else {
    //store loaded data into a global variable for tweet data
    tweetinfo = JSON.parse(data);
  }
});

//Get functions
//Shows user info
app.get('/tweets', function (req, res) {
  //send all userIDs
  res.send({ tweetinfo: tweetinfo });
});

//Shows tweet info
app.get('/tweetinfo', function (req, res) {
  //send all tweet info  
  res.send({ tweetinfo: tweetinfo });
});

//Shows searched tweets
app.get('/searchinfo', function (req, res) {
  //send array of search tweets
  res.send({ tweetsearch: tweetsearch });
});

//Posts searched tweets
app.post('/searchinfo', function (req, res) {
  //search a tweet
  var tweetid = req.body.id;
  var found = false;
  var tweetfound;

  //for each loop to push the matching tweet into the tweetsearch array
  tweetinfo.forEach(function (tweet, index) {
    if (!found && Number(tweet.id) === Number(tweetid)) {
      tweetsearch.push(tweet);
      tweetfound = tweet;
    }
  });
  res.send(tweetfound);
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function (req, res) {
  //create a tweet.

  var tweetnew = req.body.text;
  var idnew = req.body.id;
  var datenow = new Date().toString();

  tweetinfo.push({
    id: idnew,
    text: tweetnew,
    created_at: datenow
  });
});

//Update Screen Name
app.put('/tweets/:nm', function (req, res) {
  //update screen name
  var nm = req.params.nm;
  var newName = req.body.newName;

  var found = false;

  //find matching name to set screen name to a new screen name
  tweetinfo.forEach(function (tweet, index) {
    if (!found && tweet.user.name === nm) {
      tweet.user.screen_name = newName;
    }
  });
});

//Delete
app.delete('/tweetinfo/:tweetid', function (req, res) {
  //delete a tweet
  var tweetid = req.params.tweetid;

  var found = false;

  //find matching tweetid and delete it
  tweetinfo.forEach(function (tweet, index) {
    if (!found && Number(tweet.id) === Number(tweetid)) {
      tweetinfo.splice(index, 1);
    }
  });
});

app.listen(PORT, function () {
  console.log('Server listening on ' + PORT);
});