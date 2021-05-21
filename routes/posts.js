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

///Consider some change, currently built to go on posts.ejs so it needs to be in an array to work
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
    .then(function(posts)
    {
        res.render('posts', { title:`${post.title}`, posts})
    });
});

const checkhAuthenication = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.message = "You must log in to make a post";
        return res.redirect('/users/login');
    }
        
}

router.get('/create-post', checkhAuthenication, function(req, res, next) 
{
    message = req.session.message || [];
    if (req.session.message != undefined) req.session.message = undefined;
    res.render('create-post', { title: 'Create a New Post', message });
});

router.post('/create-post', function(req, res, next)
{
    const {title, content} = req.body;
    const username = req.user.username;
    const posts = req.app.locals.posts;
    const date = new date().toISOString();

    posts
    .insertOne({title, content, date, author: username})
    .then(function()
    {
        const post = posts.findOne({ title, content, date, author: username});
        res.render(`/posts/${post.id}`)
    })
    .catch(function()
    {
        req.session.message = 'An error occurred while posting. Please try again later.';
        res.redirect('/create-post');
    });
});

module.exports = router;
