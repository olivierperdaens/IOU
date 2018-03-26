let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require("express-session");
let flash = require("express-flash-messages");

let index = require('./routes/index');
let connection = require('./routes/connection');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser('keyboard cat'));

app.use(session({
    secret : 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: null,
        secure: false
    }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(require("./middlewares/auth"));

/*
  ROUTES
 */
app.use('/', index);
app.use('/connection', connection);


/*
  ERREURS
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
