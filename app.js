var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



//import packages
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

var app = express();

//Connection to database
MongoClient.connect('mongodb://localhost:27017/blogdb', {useUnifiedTopology: true}, (err, client) =>
{
  if (err) throw err;

  const db = client.db('blogdb');
  const posts = db.collection('posts');
  const users = db.collection('users');
  app.locals.posts = posts;
  app.locals.users = users;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//sessions
app.use(session(
  {
  secret: 'secretstring',
  resave:false,
  saveUninitialized:false,

  }));

//initialize passport and autheticate current session
app.use(passport.initialize());
app.use(passport.session());

//localstrategy used by passport
passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, done) =>
  {
    app.locals.users
    .findOne({ username })
    .then((user) =>
    {
      if (!user)
        return done(null, false, {message: 'Username not found'})
      
      if (user.password != password)
        return done(null, false, {message: 'Incorrect password'});
      
      return done(null,user);
    })
  }))

  passport.serializeUser((user, done) => 
  {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) =>
  {
    done(null, {id});
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
