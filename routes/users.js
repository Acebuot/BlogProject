var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Makes Users login and registration route unaccessible when logged in
const checkhAuthenication = (req, res, next) =>
{
  //redirect if already logged in
    if (req.isAuthenticated())
    {
        req.session.message = "You are already logged in";
        return res.redirect('/posts');
    }

    //send null user argument to next function
    user = null;
    next().apply(null, user);
    return next();
}

router.get('/login',checkhAuthenication, (req, res, next) =>
{
  title = "Log in";
  const message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('login', { title, message, user})
});

router.post('/login', function(req, res, next)
{
  passport.authenticate('local', function(err, user, info) 
  {
    if (err)
    {
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
      return res.redirect('/create-post');
    })
  })(req,res,next);
})

router.get('/register', checkhAuthenication, function(req, res, next)
{
  title = 'Register';
  message = req.session.message || [];
  if (req.session.message != undefined) req.session.message = undefined;
  res.render('register', {title, message, user})
});

router.post('/register', function(req, res, next)
{
  const {username, password} = req.body;
  const users = req.app.locals.users;

  users.findOne({ username }, function(err, user)
  {
    
    //if username already exists, tell user
    if (user != null)
    {
      req.session.message = `An account with that username already exists`;
      return res.redirect('/users/register')
    }

    //create user
    users
    .insertOne({ username, password })
    .then(function(){req.session.message = `Welcome to the Blog ${username}!`; res.redirect('/posts')})
    .catch(function(reason)
    {
      console.log(reason);
      req.session.message = `${reason}`;
      res.redirect('/users/register')
    });
  });

  
});

module.exports = router;
