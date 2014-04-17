'use strict';

var express = require('express');
var connect = require('connect');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port));
var Instagram = require('instagram-node-lib');
var http = require('http');
var request = require('request');
var intervalID;

/**
 * Set the paths for your files
 *
 * @type {string}
 */
var pub = __dirname + '/public',
    view = __dirname + '/views';

/**
 * Set the 'client ID' and the 'client secret key' to use on Instagram
 *
 * @type {string}
 */
var clientID = 'YOUR_CLIENT_ID',
    clientSecret = 'YOUR_CLIENT_SECRET';

/**
 * Set the configuration
 *
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', 'http://YOUR_URL.com/callback');
Instagram.set('redirect_uri', 'http://YOUR_URL.com');
Instagram.set('maxSockets', 10);

/**
 * Uses the library 'instagram-node-lib' to Subscribe to the Instagram API Real time
 * with the tag "hastag" nature
 *
 * @type {string}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'nature',
  aspect: 'media',
  callback_url: 'http://YOUR_URL.com/callback',
  type: 'subscription',
  id: '#'
});

// Socket.io config
io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

/**
 * App main configuration
 *
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('method-override')());
app.use(express.static(pub));
app.use(express.static(view));
app.use(require('errorhandler')());

/**
 * Render index view
 *
 */
app.get('/views', function (req, res) {
  res.render('index');
});

/**
 * On socket.io connection we get the most recent posts
 * and send to the client side via socket.emit
 *
 */
io.sockets.on('connection', function (socket) {
  Instagram.tags.recent({
    name: 'nature',
    complete: function (data) {
      socket.emmit('firstShow', { firstShow: data });
    }
  });
});

/**
 * Needed to receive the handshake
 *
 */
app.get('/callback', function (req, res) {
  var handshake = Instagram.subscritpions.handshake(req, res);
});

/**
 * for each new post Instagram send us the data
 *
 */
app.get('/callback', function (req, res) {
  var data = req.body;

  // Grab the hashtag 'tag.object_id'
  // Concatenate to the url and sen as a argument to the client side
  data.forEach(function (tag) {
    var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=' + clientID;
    sendMessage(url);
  });
  res.end();
});

/**
 * Send the url with the hashtag to the client side to do the ajax call based on the url
 *
 * @param {[string]} url [the url as string with the hashtag]
 */
function sendMessage(url) {
  io.sockets.emit('show', {show: url});
}

console.log('Listening on port ' + port);