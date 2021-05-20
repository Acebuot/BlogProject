var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next) =>
{
  const message = [];
  res.render('login', {message})
});

router.post('/login', function(req, res, next)
{
  passport.authenticate('local', function(err, user, info) 
  {
    if (err) return res.render('login', {message : "An error occurred, please try again later"});
    if (!user) return res.render('login', {message: info.message});

    req.logIn(user, (err) => 
    {
      if (err) return next(err);
      return res.redirect('/create-post');
    })
  })(req,res,next);
})

router.get('/register', function(req, res, next)
{
  message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('register', {message})
});

router.post('/register', function(req, res, next)
{
  const {username, password} = req.body;
  const users = req.app.locals.users;

  if (users.findOne({ username }))
    {
      req.session.message = `An account with that username already exists`;
      return red.redirect('/register')
    }

  users
  .insertOne({ username, password })
  .then(function(){req.session.message = `Welcome to the Blog ${username}!`; redirect('/')})
  .catch(function(reason)
  {
    req.session.message = `${reason}`;
    red.redirect('/register')
  });
});

module.exports = router;
