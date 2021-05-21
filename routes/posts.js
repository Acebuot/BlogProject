var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;

router.get('/posts', function(req, res, next)
{
    const posts = req.app.locals.posts;
    
    posts
    .find({})
    .toArray()
    .then(function(posts) {res.render('posts', { title: 'All Posts', posts})});
});

///Built to go on posts.ejs so it needs to be in an array to work
router.get('/posts/:id', function(req, res, next)
{
    const id = ObjectID(req.params.id);
    const posts = req.app.locals.posts;
    const arr = [];

    posts
    .findOne({ _id: id})
    .then(function(post)
    {
        const {title, content, date, author} = posts;
        arr.push(post);
        console.log(post.author);
        res.render('posts', { title:`view post`, posts: arr});
    });
});

router.get('/postsByUser/:username', function(req, res, next)
{
    const username = req.params.username;
    const posts = req.app.locals.posts;

    posts
    .find({author: username})
    .toArray()
    .then(function(posts)
    {
        console.log(posts.length);
        res.render('posts', { title:`${username}'s Posts`, posts})
    });
});

const checkhAuthenication = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.message = "You must log in to make a post";
        return res.redirect('/users/login');
    }
    return next();
}


router.get('/create-post', checkhAuthenication, function(req, res, next) 
{
    console.log('create post')
    console.log(req.user);
    console.log(req.user.username);
    console.log(req.user.password);
    message = req.session.message || [];
    if (req.session.message != undefined) req.session.message = undefined;
    res.render('create-post', { title: 'Create a New Post', message });
});

router.post('/create-post', function(req, res, next)
{
    
    const {title, content} = req.body;
    const user = req.user.username;
    const posts = req.app.locals.posts;
    const date = new Date().toISOString();

    posts
    .insertOne({title, content, date, author: user})
    .then(function()
    {
        console.log('post success')
        const post = posts.findOne({ title, content, date, author: user});
        res.render(`/posts/${ObjectID(post.id)}`)
        
    })
    .catch(function()
    {
        console.log('post catch')
        req.session.message = 'An error occurred while posting. Please try again later.';
        res.redirect('/create-post');
        
    });
});

module.exports = router;
