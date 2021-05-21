var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next) =>
{
  title = "Log in";
  const message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('login', { title, message })
});

router.post('/login', function(req, res, next)
{
  passport.authenticate('local', function(err, user, info) 
  {
    console.log('entered authenticate')
    if (err)
    {
      console.log("error in passport auth")
      req.session.message = "An error occurred, please try again later";
      return res.redirect('login');
    } 
    if (!user) 
    {
      req.session.message = info.message;
      return res.redirect('login');
    }
    req.logIn(user, (err) => 
    {
      
      if (err) return next(err);
      console.log('req login')
      console.log(req.user);
      console.log(req.user.username);
      console.log(req.user.password);
      return res.redirect('/create-post');
    })
  })(req,res,next);
})

router.get('/register', function(req, res, next)
{
  title = 'Register';
  message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('register', {title, message})
});

router.post('/register', function(req, res, next)
{
  const {username, password} = req.body;
  const users = req.app.locals.users;

  if (users.findOne({ username }))
    {
      req.session.message = `An account with that username already exists`;
      return res.redirect('/users/register')
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
