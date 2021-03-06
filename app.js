var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bearerToken = require('express-bearer-token');
var env    = process.env.NODE_ENV || 'development';
var mailer = require('express-mailer');

var routes = require('./routes/index');
var users  = require('./routes/users');
var items  = require('./routes/items');
var purchases  = require('./routes/purchases');

var app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

// setup mail
var mailConfig = require(__dirname + '/config/mail.js')[env];
mailer.extend(app, mailConfig);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bearerToken());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();
router.use('/api', routes);
router.use('/api/users', users);
router.use('/api/items', items);
router.use('/api/purchases', purchases);

// Serve static files
router.use(express.static(path.join(__dirname, 'build')));

router.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/sodaclub', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message)
});


module.exports = app;
