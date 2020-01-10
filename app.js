/eslint no-unused-vars: "off" /;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');

var userRouter = require('./routes/users');
var eventsRouter = require('./routes/events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin:'http://localhost:8080',
  credentials: true // enable set cookie
}));
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(passport.initialize());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 }
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value)
  {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length)
    {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


app.use('/', userRouter);
app.use('/events', eventsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
  next(createError(404));
});

// error handler
app.use(function (err, req, res)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let mongoConnect = require('./helpers/mongoConnect');
mongoConnect.connect();

module.exports = app;
